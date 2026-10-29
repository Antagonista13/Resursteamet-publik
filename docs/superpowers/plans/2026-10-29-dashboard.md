# Resursteamet Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Complete the approved test dashboard without replacing working TV, calendar or JSON behavior.

**Architecture:** Keep index.html and its existing handlers. Add a small dependency-free dashboard.js for shared date/import/demo helpers and staff rendering, dashboard.css for scoped responsive overrides, and demo-config.json for explicitly fictional breaks. Retain the Python updater and standard-library HTTP serving.

**Tech Stack:** HTML/CSS, browser JavaScript, Python 3.12; unittest and existing Python Playwright/Chromium for tests. No production dependency installation.

**Spec:** docs/superpowers/specs/2026-10-29-dashboard-design.md (approved by user 2026-10-29).

## Global Constraints

- Reuse work/team, resursteamet-calendar version 1 and menu.json dishes format.
- Use resursteamet_demo_calendar_v1; never automatically read or overwrite resursteamet_public_calendar_v1.
- Five fictional employees; staffing and case information remain in memory.
- Keep five-day TV mode and 12-second paging; mobile week shows all seven days.
- No production merge, deployment, environment publication or workflow execution.
- SharePoint and Outlook remain disconnected; only synthetic personal/case test data.
- Existing cloud checkout is already isolated. Use its approved development branch; no worktree required.

## Review Focus

- Tampered localStorage or imports must reject invalid dates, times, IDs, duplicate IDs and excessive counts without losing previous data.
- Calendar navigation across DST, month/year and mode switches must preserve selected date and source filters.
- Slow or failed weather/config/menu requests must terminate with an honest fallback rather than a stuck loading state.
- Test reset must preserve legacy calendar storage and clear only demo state; nonpersisted staff/case changes reset on reload.
- TV paging under load and phone rendering must keep data reachable without horizontal overflow or clipped last-row cards.

### Task 1: Menu response compatibility

**Files:** Modify scripts/update_menu.py; create tests/test_update_menu.py.
**Interfaces:** Consumes synthetic Matilda payload; produces unchanged menu.json {updatedAt, source, meals:[{date,name,dishes}]}. Extract parse_menu(payload) and main() for importable testing.
- [x] Write failing tests for courses, legacy dishes, malformed date/empty dishes, no-overwrite on failure and network failure.
- [x] Run `python3 -m unittest discover -s tests -p test_update_menu.py -v`; confirm new-format failure.
- [x] Implement courses/legacy parsing, date validation, guarded main and atomic output after successful parsing.
- [x] Run same tests; expect all pass. Commit task.

### Task 2: Safe demo calendar and responsive modes

**Files:** Modify index.html; create dashboard.js, dashboard.css, tests/test_dashboard.py.
**Interfaces:** window.Dashboard exposes dateKey(Date), localDay(string), addDays(Date,number), dayNumber(Date), isEvent(object), readEvents(raw), seedEvents(Date), importEvents(parsed,existing). Existing event object and export schema unchanged. Selected date and calendar filters drive day/week/staff views.
- [x] Write failing Chromium tests for dashboard default, mobile day default, both filters, shared selected date and DST, legacy-storage isolation, valid CRUD/export/import and rejected malformed/duplicate imports.
- [x] Run `python3 -m unittest discover -s tests -p test_dashboard.py -v`; confirm missing-mode/storage/import failures.
- [x] Add helpers, scoped CSS and controls; adapt existing rendering and handlers without rewriting TV paging, cases or backup functions. Bound requests with abort/timeout. Demo reset writes only demo storage.
- [x] Run same tests; expect pass. Commit task.

### Task 3: Staff, cases and configurable test breaks

**Files:** Modify index.html, dashboard.js, dashboard.css, tests/test_dashboard.py; create demo-config.json.
**Interfaces:** Dashboard.renderStaff(root,selectedDate,view) shows five staff and updates in-memory assignments; Dashboard.renderBreak(config,now) selects validated demo periods. demo-config.json is version 1, demo true, breaks:[{name,start,end}].
- [x] Add failing tests for five staff, date-aware status retention and reload reset, case status update, placement validation, break before/during/after boundaries, bad config and weather/menu failures.
- [x] Run dashboard tests; confirm failures identify missing behavior.
- [x] Implement in-memory staff controls, relative fictional placement dates, case status select, synthetic configurable breaks and honest service states.
- [x] Run dashboard suite; expect pass. Commit task.

### Task 4: Regression, documentation and delivery

**Files:** Extend tests/test_dashboard.py; create README.md and docs/validation-2026-10-29.md; update design approval state.
**Interfaces:** Test commands remain `python3 -m unittest discover -s tests -v`; browser tests use installed Chromium and Playwright, external calls are synthetic.
- [ ] Add regression coverage for keyboard labels, text injection, TV load paging and return to dashboard, all viewport/mode combinations and no cropped bottom cards.
- [ ] Run failures before any associated corrections; fix and rerun only affected tests.
- [ ] Run full suite, JavaScript syntax, git diff --check. Record actual counts and limits, no invented SharePoint/Outlook tests.
- [ ] Commit; obtain one independent whole-branch review, address important findings with failing regression tests first.
- [ ] Push only development branch; recheck API access and create PR if possible. If API is still blocked, keep exact PR title/body locally and report blocker without changing production network configuration.
