#!/usr/bin/env python3
"""End-to-end user-journey test via CDP (stdlib only).

Drives the product's core loop in a real browser:
  Case File -> "Run this scenario" -> Library hydrates & ranks
  -> open principle -> "Generate AI Prompt" -> Prompt Studio seeded

Usage: python3 scripts/e2e-journey.py <base-url>
Requires: Chrome already running with --remote-debugging-port=9222.
Exits non-zero if any handoff fails.
"""
import importlib.util
import json
import sys
import time
import urllib.request

_spec = importlib.util.spec_from_file_location(
    "shots", __file__.rsplit("/", 1)[0] + "/mobile-shots.py")
_shots = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_shots)

failures = []


def check(label, ok, detail=""):
    print(f"  {'PASS' if ok else 'FAIL'}  {label}" + (f" — {detail}" if detail else ""))
    if not ok:
        failures.append(label)


def js(cdp, expr):
    r = cdp.cmd("Runtime.evaluate", {"expression": expr, "returnByValue": True})
    return r.get("result", {}).get("value")


def wait_js(cdp, expr, timeout=10):
    deadline = time.time() + timeout
    while time.time() < deadline:
        v = js(cdp, expr)
        if v:
            return v
        time.sleep(0.3)
    return None


def main():
    base = sys.argv[1]
    targets = json.load(urllib.request.urlopen("http://localhost:9222/json/list"))
    page = next(t for t in targets if t["type"] == "page")
    cdp = _shots.CDP(page["webSocketDebuggerUrl"])
    cdp.cmd("Page.enable")
    # keep the onboarding tour out of the way
    cdp.cmd("Page.addScriptToEvaluateOnNewDocument",
            {"source": "try{localStorage.setItem('cognitiveEngineTourSeen','1');}catch(e){}"})

    # ── 1. Case Files -> Run this scenario ────────────────────────
    print("1. Case file -> Run this scenario")
    cdp.cmd("Page.navigate", {"url": f"{base}/examples.html"})
    wait_js(cdp, "!!document.querySelector('.case .btn-primary')")
    js(cdp, "document.querySelector('.case .btn-primary').click()")
    landed = wait_js(cdp, "location.pathname.endsWith('index.html') && location.search.includes('goal=')")
    check("navigates to Library with scenario in URL", bool(landed))
    url = js(cdp, "location.href")
    check("URL carries goal, context and problem",
          all(k in url for k in ("goal=", "context=", "problem=")), url.split("?")[-1][:110])

    # ── 2. Library hydration + ranking ────────────────────────────
    print("2. Library hydrates and ranks")
    problem_filled = wait_js(cdp,
        "(document.querySelector('.problem-field textarea')||{}).value?.length > 10")
    check("problem description hydrated into the form", bool(problem_filled))
    cards = wait_js(cdp, "document.querySelectorAll('.pcard').length")
    check("ranked principle cards rendered", bool(cards), f"{cards} cards")
    first_name = js(cdp, "document.querySelector('.pcard h4')?.textContent?.trim()")
    print(f"     top-ranked principle: {first_name}")

    # ── 3. Open the principle detail ──────────────────────────────
    print("3. Open top principle -> View Details")
    was_open = js(cdp, "document.querySelector('.pcard').classList.contains('open')")
    js(cdp, "document.querySelector('[data-card-toggle]').click()")
    flipped = wait_js(cdp,
        f"document.querySelector('.pcard').classList.contains('open') === {str(not was_open).lower()}", 5)
    check("card toggle flips open state", bool(flipped),
          f"was open: {was_open}")
    if not was_open:
        js(cdp, "document.querySelector('[data-card-toggle]').click()")  # leave it open
    js(cdp, "document.querySelector('[data-select-principle]')?.click()")
    has_sources = wait_js(cdp,
        "/Canonical sources/i.test(document.body.textContent)", 6)
    check("canonical sources shown in detail panel", bool(has_sources))

    # ── 4. Generate AI Prompt -> Prompt Studio seeded ─────────────
    print("4. Generate AI Prompt -> Prompt Studio")
    js(cdp, "document.querySelector('.pcard [data-apply-principle]').click()")
    seeded = wait_js(cdp,
        "location.pathname.endsWith('advanced-prompt-generator.html') && location.search.includes('principle=')", 12)
    check("navigates to Prompt Studio with principle in URL", bool(seeded))
    gen_url = js(cdp, "location.href")
    check("carries the scenario through", "source=library" in gen_url and "problem=" in gen_url,
          gen_url.split("?")[-1][:110])
    studio_ready = wait_js(cdp, "document.querySelectorAll('textarea').length > 0", 12)
    check("Prompt Studio loaded", bool(studio_ready))
    # poll: hydration is async; match the actual problem text from the URL
    problem_carried = wait_js(cdp, """(() => {
        const want = decodeURIComponent(
          (location.search.match(/problem=([^&]*)/) || [, ''])[1].replace(/\\+/g, ' ')
        ).slice(0, 25).toLowerCase();
        return want.length > 5 && Array.from(document.querySelectorAll('textarea'))
          .some(t => t.value.toLowerCase().includes(want));
    })()""", 10)
    check("problem text carried into the studio", bool(problem_carried))

    print()
    if failures:
        print("FAILURES:")
        for f in failures:
            print("  -", f)
        sys.exit(1)
    print("Full journey passed: Case File -> Library -> Principle -> Prompt Studio.")


if __name__ == "__main__":
    main()
