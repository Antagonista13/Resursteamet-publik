#!/usr/bin/env python3
"""Fetch publicly available Gånghesterskolan lunch dishes from Matilda."""
import datetime as dt
import json
import pathlib
import urllib.parse
import urllib.request

TODAY = dt.date.today()
MONDAY = TODAY - dt.timedelta(days=TODAY.weekday())
END = MONDAY + dt.timedelta(days=20)
BASE = "https://menu.matildaplatform.com/api/menu"
params = urllib.parse.urlencode({
    "distributorId": "68d18b0e30b565aba61bf59e",
    "startDate": MONDAY.isoformat(),
    "endDate": END.isoformat(),
    "lang": "sv"
})
url = BASE + "?" + params
req = urllib.request.Request(url, headers={"User-Agent": "Resursteamet-lunch/1.0", "Accept": "application/json"})
with urllib.request.urlopen(req, timeout=30) as resp:
    payload = json.load(resp)

def find_meals(obj):
    if isinstance(obj, list):
        if any(isinstance(x, dict) and ("date" in x or "day" in x) for x in obj):
            return obj
        for v in obj:
            result = find_meals(v)
            if result:
                return result
    if isinstance(obj, dict):
        for key in ("meals", "days", "data", "results", "menu"):
            if key in obj:
                result = find_meals(obj[key])
                if result:
                    return result
    return []

raw = find_meals(payload)
if not raw:
    raise SystemExit("No menu records returned; keeping previous menu.json")

def dishes_for(day):
    ds = day.get("dishes", [])
    if not isinstance(ds, list):
        return []
    out = []
    for d in ds:
        if isinstance(d, str) and d.strip():
            out.append(d.strip())
        elif isinstance(d, dict):
            name = d.get("name") or d.get("title") or d.get("dish")
            if isinstance(name, str) and name.strip():
                out.append(name.strip())
    return out

meals = []
for day in raw:
    if not isinstance(day, dict):
        continue
    date = str(day.get("date") or day.get("day") or "")[:10]
    try:
        dt.date.fromisoformat(date)
    except ValueError:
        continue
    dishes = dishes_for(day)
    if dishes:
        meals.append({"date": date, "name": "", "dishes": dishes})
if not meals:
    raise SystemExit("No valid menu dishes; keeping previous menu.json")
pathlib.Path("menu.json").write_text(json.dumps({
    "updatedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
    "source": url,
    "meals": meals
}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print("Saved", len(meals), "days")
