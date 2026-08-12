#!/usr/bin/env python3
"""Live keyboard-accessibility test via CDP (stdlib only).

Drives real Tab / Enter / Escape key events through Chrome and records
where focus lands, verifying:
  1. Atlas panel rows/chips are reachable and Enter-activatable
  2. The onboarding tour takes focus on open and releases it on Escape

Usage: python3 scripts/kbd-test.py <base-url>
Requires: Chrome already running with --remote-debugging-port=9222.
"""
import importlib.util
import json
import sys
import time
import urllib.request

# reuse the CDP plumbing (ws_connect / CDP) from mobile-shots.py
_spec = importlib.util.spec_from_file_location(
    "shots", __file__.rsplit("/", 1)[0] + "/mobile-shots.py")
_shots = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_shots)


def describe(cdp):
    r = cdp.cmd("Runtime.evaluate", {
        "expression": """(() => { const el = document.activeElement;
            if (!el) return null;
            return {tag: el.tagName, id: el.id || '',
                    cls: (el.getAttribute('class')||'').slice(0,44),
                    role: el.getAttribute('role')||'',
                    disc: el.getAttribute('data-disc')||'',
                    node: el.getAttribute('data-node')||'',
                    text: (el.textContent||'').trim().slice(0,42)}; })()""",
        "returnByValue": True})
    return r.get("result", {}).get("value")


def key(cdp, key_name, code, vk):
    for t in ("rawKeyDown", "keyUp"):
        cdp.cmd("Input.dispatchKeyEvent",
                {"type": t, "key": key_name, "code": code,
                 "windowsVirtualKeyCode": vk, "nativeVirtualKeyCode": vk})


def tab(cdp):
    key(cdp, "Tab", "Tab", 9)


def enter(cdp):
    key(cdp, "Enter", "Enter", 13)


def escape(cdp):
    key(cdp, "Escape", "Escape", 27)


def main():
    base = sys.argv[1]
    cdp = _shots.CDP(_shots.get_page_ws_url())
    cdp.cmd("Page.enable")

    failures = []

    # ── Scenario 1: Atlas panel keyboard reachability ─────────────
    cdp.cmd("Page.navigate", {"url": f"{base}/cognitive-atlas.html"})
    time.sleep(6)  # data load + intro settle
    stops = []
    enter_result = None
    for _ in range(24):
        tab(cdp)
        time.sleep(0.12)
        d = describe(cdp)
        if not d:
            continue
        stops.append(d)
        if d["disc"] and enter_result is None:
            # activate the first focused field row with Enter
            before = cdp.cmd("Runtime.evaluate", {
                "expression": "document.querySelector('#panel-head .p-title')?.textContent || ''",
                "returnByValue": True})["result"].get("value", "")
            enter(cdp)
            time.sleep(1.2)
            after = cdp.cmd("Runtime.evaluate", {
                "expression": "document.querySelector('#panel-head .p-title')?.textContent || ''",
                "returnByValue": True})["result"].get("value", "")
            enter_result = (d["disc"], before, after)
    disc_stops = [s for s in stops if s["disc"]]
    print(f"Atlas: {len(stops)} focus stops, {len(disc_stops)} on field rows")
    for s in stops[:14]:
        print("  ", s["tag"], s["cls"] or s["id"], s["role"], s["disc"] or s["node"],
              "|", s["text"][:36])
    if not disc_stops:
        failures.append("Atlas field rows never received focus")

    # Enter activation was already exercised on the first focused row
    if enter_result:
        disc, before, after = enter_result
        print(f"Enter on field row '{disc}': panel '{before}' -> '{after}'")
        if after == before or not after:
            failures.append("Enter on field row did not open the discipline panel")

    # ── Scenario 2: tour focus in / Escape out ────────────────────
    cdp.cmd("Page.navigate", {"url": f"{base}/index.html"})
    time.sleep(4)  # auto-tour starts ~1.5s in
    d = describe(cdp)
    print("Index tour open, activeElement:", d["id"] or d["tag"], d["cls"])
    if d["id"] != "cog-tour-panel":
        failures.append(f"Tour did not take focus on open (focused: {d['id'] or d['tag']})")
    escape(cdp)
    time.sleep(0.8)
    gone = cdp.cmd("Runtime.evaluate", {
        "expression": "document.getElementById('cog-tour-panel') === null",
        "returnByValue": True})["result"].get("value", False)
    print("Escape closed tour:", gone)
    if not gone:
        failures.append("Escape did not close the tour")

    print()
    if failures:
        print("FAILURES:")
        for f in failures:
            print("  -", f)
        sys.exit(1)
    print("All keyboard checks passed.")


if __name__ == "__main__":
    main()
