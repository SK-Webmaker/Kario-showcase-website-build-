# Memory

One dated JSON snapshot per weekly run: `YYYY-MM-DD.json`, dated the Monday
of the week it describes. This is what makes the loop compound instead of
restarting every Monday.

Each snapshot carries four things the next run needs:

1. **The account's numbers** — followers, reach, average engagement rate, and
   the **format split** (average engagement by media type). The format split
   is the single most decision-shaping number in the file.
2. **The attribution result** — for every caption authored last week, whether
   it actually went up, and if not, the operator's reason. A post that never
   went up is an unrun experiment, not a failed one; the schema keeps those
   two states apart on purpose.
3. **The prediction that was written last week**, and whether it held.
4. **What the operator said** — verbatim where possible.

## Rules

- `null` means **unmeasured**. It never means zero. Anything the run could not
  read stays `null` and is reported as "unmeasured".
- Never back-fill a snapshot with an estimate. An absent week is more useful
  than an invented one.
- `source` on every metric block says where the figure came from — an API, a
  screenshot the operator sent, or a manual count.
