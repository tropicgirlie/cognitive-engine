#!/usr/bin/env python3
"""True mobile-viewport screenshots via CDP (stdlib only).

Chrome headless CLI clamps window width to ~500px, so --window-size=390
silently crops a 500px layout. This script drives Chrome over the DevTools
protocol and uses Emulation.setDeviceMetricsOverride for a real 390px
mobile viewport.

Usage: python3 scripts/mobile-shots.py <base-url> <out-dir> [--width=N] [--height=N] [--noframe] <page1> [page2...]
Requires: Chrome already running with --remote-debugging-port=9222.
Default viewport is 390x844 @2x mobile; use --width=768 --height=1024 for tablet.
"""
import base64
import hashlib
import json
import os
import socket
import struct
import sys
import time
import urllib.request

DEBUG_PORT = 9222


def get_page_ws_url(timeout=40):
    """Poll the DevTools HTTP endpoint until a page target is available."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            targets = json.load(
                urllib.request.urlopen(f"http://localhost:{DEBUG_PORT}/json/list", timeout=3))
            page = next((t for t in targets if t.get("type") == "page"), None)
            if page:
                return page["webSocketDebuggerUrl"]
        except Exception:
            pass
        time.sleep(0.5)
    raise RuntimeError(f"Chrome DevTools endpoint not ready after {timeout}s")


def ws_connect(url):
    assert url.startswith("ws://")
    rest = url[5:]
    hostport, _, path = rest.partition("/")
    host, _, port = hostport.partition(":")
    s = socket.create_connection((host, int(port or 80)), timeout=15)
    key = base64.b64encode(os.urandom(16)).decode()
    req = (
        f"GET /{path} HTTP/1.1\r\nHost: {hostport}\r\n"
        "Upgrade: websocket\r\nConnection: Upgrade\r\n"
        f"Sec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n"
    )
    s.sendall(req.encode())
    resp = b""
    while b"\r\n\r\n" not in resp:
        chunk = s.recv(4096)
        if not chunk:
            raise RuntimeError("handshake failed")
        resp += chunk
    assert b"101" in resp.split(b"\r\n", 1)[0], resp[:200]
    return s


def ws_send(s, payload: str):
    data = payload.encode()
    header = bytearray([0x81])  # FIN + text
    n = len(data)
    if n < 126:
        header.append(0x80 | n)
    elif n < 65536:
        header.append(0x80 | 126)
        header += struct.pack(">H", n)
    else:
        header.append(0x80 | 127)
        header += struct.pack(">Q", n)
    mask = os.urandom(4)
    header += mask
    masked = bytes(b ^ mask[i % 4] for i, b in enumerate(data))
    s.sendall(bytes(header) + masked)


def _recv_exact(s, n):
    buf = b""
    while len(buf) < n:
        chunk = s.recv(min(65536, n - len(buf)))
        if not chunk:
            raise RuntimeError("connection closed")
        buf += chunk
    return buf


def ws_recv(s):
    """Receive one complete (possibly fragmented) text message."""
    payload = b""
    while True:
        b1, b2 = struct.unpack("BB", _recv_exact(s, 2))
        fin = b1 & 0x80
        opcode = b1 & 0x0F
        masked = b2 & 0x80
        length = b2 & 0x7F
        if length == 126:
            length = struct.unpack(">H", _recv_exact(s, 2))[0]
        elif length == 127:
            length = struct.unpack(">Q", _recv_exact(s, 8))[0]
        mask = _recv_exact(s, 4) if masked else None
        data = _recv_exact(s, length) if length else b""
        if mask:
            data = bytes(b ^ mask[i % 4] for i, b in enumerate(data))
        if opcode == 0x9:  # ping -> pong
            pong = bytearray([0x8A])
            pong.append(0x80 | len(data))
            m = os.urandom(4)
            pong += m + bytes(b ^ m[i % 4] for i, b in enumerate(data))
            s.sendall(bytes(pong))
            continue
        payload += data
        if fin:
            return payload.decode("utf-8", "replace")


class CDP:
    def __init__(self, ws_url):
        self.s = ws_connect(ws_url)
        self.next_id = 1

    def cmd(self, method, params=None, timeout=30):
        mid = self.next_id
        self.next_id += 1
        ws_send(self.s, json.dumps({"id": mid, "method": method, "params": params or {}}))
        deadline = time.time() + timeout
        while time.time() < deadline:
            msg = json.loads(ws_recv(self.s))
            if msg.get("id") == mid:
                if "error" in msg:
                    raise RuntimeError(f"{method}: {msg['error']}")
                return msg.get("result", {})
        raise TimeoutError(method)


def main():
    base, out_dir = sys.argv[1], sys.argv[2]
    width, height = 390, 844
    suppress_tour = False
    pages = []
    for arg in sys.argv[3:]:
        if arg.startswith("--width="):
            width = int(arg.split("=", 1)[1])
        elif arg.startswith("--height="):
            height = int(arg.split("=", 1)[1])
        elif arg == "--notour":
            suppress_tour = True
        else:
            pages.append(arg)
    os.makedirs(out_dir, exist_ok=True)

    targets_url = get_page_ws_url()
    cdp = CDP(targets_url)

    cdp.cmd("Page.enable")
    cdp.cmd("Emulation.setDeviceMetricsOverride",
            {"width": width, "height": height, "deviceScaleFactor": 2, "mobile": True})
    cdp.cmd("Emulation.setTouchEmulationEnabled", {"enabled": True})

    if suppress_tour:
        cdp.cmd("Page.addScriptToEvaluateOnNewDocument",
                {"source": "try{localStorage.setItem('cognitiveEngineTourSeen','1');}catch(e){}"})

    for p in pages:
        cdp.cmd("Page.navigate", {"url": f"{base}/{p}"})
        time.sleep(5 if "atlas" in p else 3.5)
        shot = cdp.cmd("Page.captureScreenshot", {"format": "png"}, timeout=30)
        name = p.replace(".html", "") + ".png"
        with open(os.path.join(out_dir, name), "wb") as f:
            f.write(base64.b64decode(shot["data"]))
        print("saved", name)


if __name__ == "__main__":
    main()
