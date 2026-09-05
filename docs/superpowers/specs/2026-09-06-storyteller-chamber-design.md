# Storyteller Chamber (Locked: Approach A)

**Goal:** Poster War opens as a shared story, not a rules dump. Every phase has a Mafia-style announcement. Committee Heads play to win their department — not just to pick a President.

**Approved:** 2026-09-06, Approach A.

## Player flow

1. **Cold open (shared, ~20s).** Three storyteller beats, fade between them. No rules page.
   - Asteria has ₹100L and no President.
   - Two tickets. Five committees. Three votes take the chair.
   - Committees win if their department survives the year.
2. **Role cards.** One icon, one title, one trait. Occupied = `OCCUPIED · NAME` or `YOUR SEAT`. Vacant = `TAKE SEAT`. Never `HELD BY`.
3. **After every phase.** 4-second full-screen storyteller card, click-to-dismiss, fade into the desk. Desk never unmounts underneath.
4. **Head desk.** Always-on 3-point victory meter + both candidate faces (pledge / endorse). Cinema is a banner, not a takeover. Other heads stay hidden.
5. **Candidate desk.** War room. Need 3 of 5. Five faces. Crisis = two doors.
6. **Motion.** Fade every scene. Card hover lift. Sequential slam on verdicts and ballot reveals.

## Committee Head win (original scoring, now visible)

Need **3+ points** for Department Supremacy:

| Condition | Points |
|---|---|
| Floor budget met (Sports/Hostel ₹25L, Culture ₹30L, Placement/Welfare ₹20L) | +2 |
| Flagship commissioned (Carnival / Commons / Career Lab / Renewal) | +1 |
| Secret ballot matched the winner | +1 |
| Red line breached | −1 |
| Public endorsement betrayed in the vault | −1 |

A Head can win even if their candidate loses.

## Bugs in the same pass

- React Error Boundary so a render error never blanks the page.
- `CountStage` must not crash (`IconBallot` import; safe `roleTitle`).
- Hung elections resolve by plurality, Builder on a true tie. Never throw `election produced no winner`.

## Out of scope

- New reducers or tables.
- Showing other committee heads on a Head’s desk.
- Framer Motion dependency (CSS scene fades only).
