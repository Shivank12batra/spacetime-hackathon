# Kingmaker

## Final Game Design Specification

**Format:** Real-time, browser-based multiplayer social strategy game  
**Players:** Exactly 7 for the hackathon prototype  
**Roles:** 2 presidential candidates and 5 committee power brokers  
**Target match length:** 14 minutes  
**Setting:** A fictional elite Indian residential college  
**Primary technology constraint:** SpacetimeDB must operate as the authoritative shared world, rules engine, timer, and private-information layer

---

## 1. One-Sentence Pitch

Two students compete to become Student Council President by negotiating with five committee heads whose votes they need, while campus events strain their alliances, expose conflicting interests, and force them to make promises they may betray once they control the budget.

---

## 2. Player Fantasy

The fantasy is not merely “winning an election.”

Candidates experience:

- persuading real people rather than maximizing an abstract popularity meter;
- assembling a coalition from incompatible interests;
- appearing principled in public while negotiating privately;
- deciding whom to reward or betray after gaining power.

Power brokers experience:

- controlling a decisive vote;
- negotiating for their committee and personal agenda;
- supporting, opposing, exposing, or betraying candidates;
- discovering whether the winner actually honours their deal;
- succeeding personally even if they voted for the losing candidate.

Every player must have agency, private information, something to gain, and something to lose.

---

## 3. World

The game takes place at **Asteria Institute**, a fictional elite Indian residential college with recognizable IIM/IIT-style campus institutions.

It is election month. The Student Council President controls:

- a **₹100 lakh Student Life Budget**;
- approval of **one flagship campus project**;
- the political direction of campus life for the coming year.

The campus cares about:

- sports facilities and inter-college competitions;
- the annual cultural fest and social scene;
- hostel infrastructure, Wi-Fi and mess quality;
- placements, academics and institutional prestige;
- affordability, welfare and inclusion.

These demands intentionally exceed the resources available. No candidate can satisfy everyone.

The campus is represented through:

- a live social feed;
- event and crisis cards;
- candidate profiles and endorsements;
- private negotiation cards;
- changing relationships;
- the final election and budget reveal.

There is no explorable map, player movement, 3D environment, or open-ended simulation.

---

## 4. Design Pillars

### 4.1 Every human is a player

The five non-candidates are not spectators. Each is a power broker with:

- one decisive ballot;
- a constituency;
- a public demand;
- a private objective;
- a hidden red line;
- relationships with both candidates;
- a personal end-game score.

### 4.2 Human judgment decides the election

There is no opaque popularity formula and no simulated general-student vote.

Each of the five power brokers casts one secret ballot. The first candidate to receive three votes wins.

### 4.3 Structured mechanics support verbal politics

Players negotiate verbally, but consequential commitments must be recorded through structured game actions.

The system never attempts to evaluate whether a freeform speech was charismatic, funny, or morally correct.

### 4.4 Information is layered

**Public information**

- candidate decisions;
- manifesto priorities;
- public endorsements and withdrawals;
- public support or opposition;
- exposed private deals;
- campus events and consequences.

**Private information**

- accepted private deals;
- exact relationship states;
- private objectives and red lines;
- final ballots.

### 4.5 Chaos comes from incentives, not randomness

The event deck creates pressure, but the memorable chaos comes from:

- incompatible committee interests;
- candidates promising more than they can deliver;
- public endorsements that may not match private ballots;
- private deals being exposed;
- final allocation revealing who was used.

---

## 5. Roles

## 5.1 Candidate A: The Builder

**Public image:** Competent, serious, policy-oriented and slightly elitist.

**Strengths**

- Starts Allied with the Placement & Academic Representative.
- Naturally credible when discussing infrastructure and long-term development.

**Weaknesses**

- Perceived as boring and disconnected from campus social culture.
- Must actively win over socially influential blocs.

**Primary objective**

- Become President by receiving at least three votes.

The Builder is not automatically ethical. The player may become highly transactional or betray the groups that trusted their competence.

## 5.2 Candidate B: The Campus Star

**Public image:** Popular, socially connected, energetic and potentially irresponsible.

**Strengths**

- Starts Allied with the Cultural Secretary.
- Naturally credible when discussing campus life, festivals and participation.

**Weaknesses**

- Institutional actors question whether they can govern.
- Must prove they offer more than excitement and popularity.

**Primary objective**

- Become President by receiving at least three votes.

The Campus Star is not automatically shallow. The player may build a surprisingly effective coalition and govern more responsibly than expected.

Candidate names and profile avatars may be chosen in the lobby. Their mechanical archetypes remain fixed.

---

## 6. Power Brokers

Every broker has a public minimum budget demand, a private objective, a hidden red line, one vote, and a personal score.

## 6.1 Sports Secretary

**Constituency:** Athletes, sports teams and hostel sports blocs  
**Public demand:** At least ₹25L for facilities and tournament travel  
**Private objective:** The Inter-College Carnival is selected as the flagship project  
**Red line:** Sports receives less funding than Culture  
**Starting relationships:** Open with both candidates  
**Character tension:** The Builder is an old friend, but the Campus Star previously helped save a tournament

## 6.2 Cultural Secretary

**Constituency:** Cultural clubs, performers and the socially influential crowd  
**Public demand:** At least ₹30L for the annual fest  
**Private objective:** The Inter-College Carnival is selected as the flagship project  
**Red line:** A restrictive night curfew is accepted  
**Starting relationships:** Allied with the Campus Star; Open with the Builder  
**Character tension:** Wants a memorable legacy and believes “campus life” is treated as frivolous by policy-focused students

## 6.3 Hostel & Mess Representative

**Constituency:** Hostel residents and students focused on everyday campus life  
**Public demand:** At least ₹25L for repairs, Wi-Fi and mess improvements  
**Private objective:** The 24/7 Student Commons is selected as the flagship project  
**Red line:** Students are forced to pay a new compulsory fee  
**Starting relationships:** Open with both candidates  
**Character tension:** Trusts competence but resents being ignored until something breaks

## 6.4 Placement & Academic Representative

**Constituency:** Placement-focused and academically competitive students  
**Public demand:** At least ₹20L for preparation, case competitions and corporate events  
**Private objective:** The Career and Startup Lab is selected as the flagship project  
**Red line:** A major unresolved controversy is allowed to disrupt recruiter week  
**Starting relationships:** Allied with the Builder; Open with the Campus Star  
**Character tension:** Protects institutional prestige but may tolerate questionable compromises to do so

## 6.5 Student Welfare Representative

**Constituency:** Students concerned with affordability, mental health, safety and accessibility  
**Public demand:** At least ₹20L for welfare programmes  
**Private objective:** The Campus Renewal Plan is selected as the flagship project  
**Red line:** Any compulsory student fee or exclusionary policy is approved  
**Starting relationships:** Open with both candidates  
**Character tension:** Wants principled governance but needs political leverage to achieve it

The five public minimum demands total ₹120L. The President has only ₹100L.

---

## 7. Flagship Projects

The elected President chooses exactly one:

### Inter-College Carnival

A combined cultural and sports showcase that improves campus prestige.

Most attractive to Sports and Culture.

### 24/7 Student Commons

A renovated common space with night food, study facilities and student services.

Most attractive to Hostel, Culture and Welfare.

### Career and Startup Lab

A dedicated placement, case competition and entrepreneurship facility.

Most attractive to Placement and prestige-focused players.

### Campus Renewal Plan

Repairs hostel infrastructure and upgrades shared sports and accessibility facilities.

Most attractive to Hostel, Welfare and Sports.

Projects intentionally overlap constituencies so candidates can construct coalitions through combinations of budget and project commitments.

---

## 8. Relationship System

Each candidate–broker pair has one private relationship state.

There are no numerical Trust points.

### Open

- Default relationship.
- Private negotiation is allowed.
- No public endorsement is active.

### Allied

- Reached by accepting a private deal or repeatedly supporting a candidate.
- The broker may publicly endorse the candidate.
- A broker may be Allied with both candidates.
- Voting against an active public endorsement creates the broker’s betrayal penalty.

### Burned

- Private negotiation between the pair is blocked.
- Any public endorsement is automatically withdrawn.
- The broker may still vote for the candidate.
- Later support during a campus event can repair Burned to Open.

### Relationship transitions

- Accept a private deal: move directly to Allied.
- Approve a candidate’s event response: move one step toward Allied.
- Disapprove a candidate’s event response: move one step toward Burned.
- Expose a private deal: move directly to Burned.
- Candidate contradicts an accepted deal during the campaign: move directly to Burned.
- Candidate fails to honour an accepted deal in the final allocation: end the relationship as Burned.

### Visibility

The exact relationship state is visible only to the relevant candidate and broker.

Everyone can see:

- public endorsements;
- endorsement withdrawals;
- public approval and opposition;
- exposed deals;
- visible conflicts.

The final results reveal relationships that ended through budget betrayal.

---

## 9. Private Deals

Private deals are the central negotiation primitive.

Players negotiate verbally and then record the consequential offer in the interface.

## 9.1 Offer fields

A candidate selects:

- one broker;
- promised committee budget from ₹0L to ₹40L in ₹5L increments;
- one flagship project or no project;
- requested support:
  - private electoral support; or
  - public endorsement.

An offer must contain a non-zero budget promise, a flagship project, or both.

There is no free-text field.

## 9.2 Broker responses

The broker may:

- Accept
- Reject
- Counter

A counter changes the budget, project, requested support, or a combination of those fields.

## 9.3 Deal rules

- Only one accepted deal may exist per candidate–broker pair.
- A newly accepted deal replaces the previous accepted deal for that pair.
- Deals do not reserve or deduct budget.
- A candidate may promise more than ₹100L across different deals.
- Accepting a deal moves the relationship to Allied.
- An accepted request for electoral support does not bind the broker’s secret ballot.
- An accepted public-endorsement request allows, but does not automatically force, endorsement.
- Deals lock when the Final Soapbox begins.
- Either party may expose a real deal publicly before deals lock.
- Exposing a deal moves that candidate–broker relationship to Burned.
- There are no fabricated rumours in the MVP.

## 9.4 Final deal resolution

After the President allocates the budget:

- a budget promise is honoured if the committee receives at least the promised amount;
- a project promise is honoured if the promised project is chosen;
- a deal containing both terms is fully honoured only if both are satisfied;
- otherwise the deal is marked betrayed.

All accepted deals involving the winner are revealed in the final results.

Deals involving the losing candidate remain irrelevant to final committee outcomes.

There is no aggregate Promise Ledger or “total promised” meter during the campaign.

---

## 10. Power-Broker Scoring

Power brokers score only after the President completes the final allocation.

### Score

- **+2:** Committee receives its public minimum budget
- **+1:** Private objective is achieved
- **+1:** Broker voted for the winning candidate
- **−1:** Red line was violated
- **−1:** Broker voted against an active public endorsement without withdrawing it first

### Result tiers

- **3–4 points:** Political victory
- **1–2 points:** Partial success
- **0 or below:** Political defeat

Backing the winner is deliberately only a small part of the score. A broker who correctly predicts the winner but receives nothing still loses.

A broker who voted for the loser can succeed if the winner nevertheless funds their constituency and satisfies their private objective.

Trust states are not added to the score.

---

## 11. Candidate Victory and Final Consequences

The candidate who receives at least three ballots becomes President immediately.

There is:

- no confidence vote;
- no second election;
- no candidate points leaderboard;
- no binding manifesto;
- no pre-election budget lock.

After winning, the President:

1. allocates exactly ₹100L across the five committees in ₹5L increments;
2. chooses one flagship project;
3. submits the final government.

The final allocation is intentionally a dramatic power reveal rather than another competitive challenge for the President.

It determines:

- which brokers succeed;
- which accepted deals were honoured;
- which allies were betrayed;
- which red lines were violated;
- the final political story of the match.

The President receives a descriptive ending based on behaviour, such as:

- Coalition Builder
- Promise Keeper
- Power Grabber
- Campus Populist
- Development President

These are narrative labels, not another scoring system.

---

## 12. Match Structure

The match lasts 14 minutes and contains six rounds.

## Round 1: Manifesto Launch — 2 minutes

Each candidate selects two public priorities from:

- Sports
- Culture and Campus Life
- Hostel and Mess
- Placements and Academics
- Student Welfare

The priorities communicate political identity but do not reserve budget.

Candidates and brokers may begin verbal negotiations and record private deals.

The public feed announces:

- candidate profiles;
- selected priorities;
- initial public statements;
- any early endorsements.

## Round 2: Everyday Campus Issue — 2 minutes

One event is selected from the Everyday Campus deck.

Candidates negotiate, submit decisions secretly, and reveal simultaneously.

Power brokers react to each candidate.

## Round 3: Campus Opportunity — 2 minutes

One event is selected from the Campus Opportunity deck.

This round creates competition over prestige, visibility and scarce institutional attention.

## Round 4: Values Conflict — 2 minutes

One event is selected from the Values Conflict deck.

This round tests red lines and makes previously compatible coalitions harder to maintain.

## Round 5: Final Soapbox — 2 minutes

Private deals lock at the beginning of this round.

The shared screen summarizes:

- each candidate’s public priorities;
- decisions across the three events;
- current endorsements;
- exposed private deals;
- visible conflicts.

Each candidate receives a short verbal pitch window.

Power brokers may:

- retain an endorsement;
- publicly withdraw an endorsement;
- expose one existing deal if still eligible;
- make their final private assessment.

No new deals may be created.

## Round 6: Election and Allocation — 4 minutes

1. All five power brokers cast secret ballots.
2. Ballots lock once submitted.
3. When all ballots are present, they reveal one at a time.
4. The first candidate to three votes becomes President.
5. All five ballots still reveal for scoring.
6. The President allocates ₹100L.
7. The President selects one flagship project.
8. Broker scores and deal outcomes are calculated.
9. Final results reveal committee by committee.

Abstention is not allowed, preventing a tied election.

---

## 13. Standard Event Loop

Rounds 2–4 use the same interaction pattern.

### Step 1: Event appears

Everyone sees:

- the situation;
- the affected areas of campus;
- three candidate responses;
- the round timer.

### Step 2: Negotiation

Players receive approximately 45 seconds to talk.

Candidates may create or revise structured private deals while relationships permit.

### Step 3: Secret candidate choice

Each candidate selects one authored response.

Where the event supports it, the candidate may attach a public budget commitment in ₹5L increments.

Responses cannot change after submission.

### Step 4: Simultaneous reveal

Both candidate choices appear together.

This prevents the second candidate from copying or simply opposing the first.

### Step 5: Broker reactions

Each broker independently chooses for each candidate:

- Approve
- Disapprove
- No reaction

Reactions are public.

Relationship movement is private:

- Approve moves Burned → Open or Open → Allied.
- Disapprove moves Allied → Open or Open → Burned.
- Moving from Allied to Open automatically withdraws any active endorsement.
- No reaction does not change the relationship.

### Step 6: World consequence

The selected policies become persistent campus facts.

Examples:

- the night curfew now exists;
- a compulsory student fee was approved;
- the fest was scaled down;
- recruiter week remains protected;
- tournament travel was funded in principle.

These facts can:

- trigger a broker’s red line;
- satisfy a private objective;
- appear during the Final Soapbox;
- affect the interpretation of later events.

### Step 7: Feed update

The campus feed records:

- candidate choices;
- broker approval or opposition;
- endorsements or withdrawals;
- exposed deals;
- resulting campus policy.

---

## 14. Event Deck

The prototype contains six authored cards. Each match draws one from each pair.

There is no generative event creation.

## 14.1 Everyday Campus Events

### Event A: The Night-Canteen Bill

The mess contractor offers to keep the night canteen open, but only with a compulsory student fee.

**Candidate choices**

1. Accept the fee and keep the canteen open.
2. Reject the fee and publicly promise a subsidy.
3. Close the night canteen and prioritize essential mess improvements.

**Primary tensions**

- Culture values night-campus life.
- Hostel values food access and quality.
- Welfare opposes compulsory fees.
- Placement may prefer financial restraint.

**Persistent facts**

- compulsory fee approved;
- subsidy promised;
- or night canteen closed.

### Event B: Placement Week Blackout

Hostel Block C loses reliable Wi-Fi days before placement interviews.

**Candidate choices**

1. Promise a full network upgrade.
2. Approve a temporary hotspot solution.
3. Wait for the existing vendor and avoid a new commitment.

**Primary tensions**

- Hostel wants durable infrastructure.
- Placement needs an immediate solution.
- Welfare cares whether disadvantaged students receive equal access.

**Persistent facts**

- long-term upgrade promised;
- temporary access restored;
- or the issue remains unresolved.

## 14.2 Campus Opportunity Events

### Event C: The National Tournament

The college team unexpectedly qualifies for a national tournament requiring major travel support.

**Candidate choices**

1. Fully back the trip.
2. Offer partial support and require external sponsorship.
3. Decline the expense and prioritize wider campus programmes.

**Primary tensions**

- Sports considers this a defining opportunity.
- Placement values sponsorship and institutional networking.
- Welfare questions spending heavily on a small group.
- Culture fears losing funds to Sports.

**Persistent facts**

- tournament fully backed;
- sponsorship required;
- or tournament opportunity declined.

### Event D: The Fest Sponsor

A major brand offers to rescue the annual fest but demands extensive branding and student-data collection.

**Candidate choices**

1. Accept all sponsor terms.
2. Reject the sponsor and promise institutional funding.
3. Accept limited branding but prohibit student-data collection.

**Primary tensions**

- Culture needs the fest.
- Placement values the corporate relationship.
- Welfare objects to compulsory data collection.
- Hostel questions using student funds for the fest.

**Persistent facts**

- unrestricted sponsorship accepted;
- self-funded fest promised;
- or restricted sponsorship negotiated.

## 14.3 Values Conflict Events

### Event E: The 11 PM Curfew

After a late-night incident, the administration proposes an 11 PM campus curfew.

**Candidate choices**

1. Accept the curfew to protect institutional reputation.
2. Reject it and promise night transport and security.
3. Negotiate a temporary 1 AM limit with a review.

**Primary tensions**

- Culture has a direct red line against a restrictive curfew.
- Welfare values safety but opposes collective punishment.
- Placement fears public controversy.
- Hostel values student autonomy.

**Persistent facts**

- strict curfew accepted;
- curfew rejected with a spending promise;
- or temporary compromise established.

### Event F: Fest Versus Recruiter Week

The administration schedules an important recruiter programme during the annual fest.

**Candidate choices**

1. Move the fest.
2. Protect the fest dates and ask recruiters to adapt.
3. Split venues and promise additional logistics funding.

**Primary tensions**

- Culture views moving the fest as surrender.
- Placement treats recruiter access as non-negotiable.
- Hostel and Welfare care about disruption and additional costs.

**Persistent facts**

- fest rescheduled;
- recruiter relationship strained;
- or expensive compromise promised.

---

## 15. Endorsements and Betrayal

An Allied broker may publicly endorse one candidate at a time.

An endorsement:

- is visible to everyone;
- may be withdrawn before ballots open;
- communicates political momentum but does not count as a ballot;
- does not mechanically force the broker’s final vote.

If a broker votes against their active public endorsement:

- the ballot remains valid;
- the broker receives the −1 betrayal penalty;
- the mismatch is revealed in the final results.

If the broker withdraws the endorsement before voting, there is no betrayal penalty.

This supports last-minute defections without making public commitments meaningless.

---

## 16. Final Reveal

The final reveal should be the most theatrical part of the game while remaining mechanically simple.

### Ballot reveal

Each broker card flips to show:

- chosen candidate;
- whether the vote matched their public endorsement.

The President is declared as soon as the third vote appears.

### Allocation reveal

The President submits the full budget privately, then everyone sees:

- Sports allocation;
- Culture allocation;
- Hostel allocation;
- Placement allocation;
- Welfare allocation;
- flagship project.

### Committee reveal

Each broker’s card then reveals:

- public budget target;
- previously hidden private objective;
- previously hidden red line;
- accepted deal with the President, if any;
- whether the deal was honoured;
- final Agenda Points;
- Victory, Partial Success, or Political Defeat.

The reveal explains the social story rather than showing only numbers.

Example:

> Culture publicly backed the Campus Star and voted for them. The fest received ₹30L, but the President approved a strict curfew. Culture finishes with Partial Success.

---

## 17. Information and Screen Visibility

## 17.1 Shared public information

All players see:

- current round and timer;
- candidate identities and priorities;
- current event;
- revealed candidate decisions;
- public reactions;
- endorsements and withdrawals;
- exposed deals;
- persistent campus facts;
- election and allocation results.

## 17.2 Candidate-private information

Each candidate sees:

- their relationship with every broker;
- deals they proposed;
- counters and accepted deals;
- private support claims received from brokers;
- their own locked event choice before reveal.

A candidate cannot see:

- the other candidate’s private deals;
- broker objectives and red lines unless verbally disclosed;
- final ballots before reveal.

## 17.3 Broker-private information

Each broker sees:

- their public demand;
- private objective;
- red line;
- relationship with both candidates;
- offers received from both candidates;
- their own ballot before reveal.

A broker cannot see:

- other brokers’ private objectives;
- deals not involving them;
- other ballots before reveal.

---

## 18. UI Direction

Functionality and clarity take priority over visual ambition.

The interface should borrow the accessibility of Status-style social simulation:

- familiar profile cards;
- a chronological social feed;
- prominent event cards;
- immediate outcome banners;
- private relationship and negotiation panels;
- dramatic but minimal reveal animations.

It should not reproduce Status’s exact visual design.

## 18.1 Lobby

- Room title
- Seven role slots
- Candidate and broker descriptions
- Ready state
- Start button

The hackathon MVP requires all seven roles to be filled.

## 18.2 Main game screen

**Top**

- round name;
- countdown timer;
- match progress.

**Centre**

- current event card;
- candidate responses after reveal;
- chronological campus feed.

**Left**

- two candidate cards;
- public manifesto priorities;
- public endorsements.

**Right**

- five broker cards;
- public committee demands;
- visible reactions and endorsement state.

**Private bottom panel**

- role objective;
- relationship states;
- received or proposed deals;
- context-specific actions.

## 18.3 Election screen

- final candidate summaries;
- private ballot control for brokers;
- submitted/not-submitted status without vote contents;
- one-by-one ballot reveal.

## 18.4 Allocation screen

- five committee allocation controls in ₹5L increments;
- remaining-budget indicator;
- flagship-project selector;
- submit confirmation.

## 18.5 Results screen

- President
- final allocation
- broker result cards
- honoured and betrayed deals
- relationship endings
- shareable match summary

Animations should be limited to:

- card entry;
- simultaneous candidate reveal;
- endorsement movement;
- ballot flips;
- final result cards.

---

## 19. SpacetimeDB as the Core Workflow

SpacetimeDB is not used only for presence, chat, or saving results. It owns the entire match.

## 19.1 Authoritative shared state

SpacetimeDB stores:

- room and match phase;
- authenticated role ownership;
- candidate priorities;
- broker objectives;
- relationships;
- private deals;
- event selection;
- hidden candidate decisions;
- broker reactions;
- endorsements;
- campus facts;
- secret ballots;
- final allocations;
- scores and results.

## 19.2 Authoritative actions

Every consequential interaction is a server-side reducer action:

- claim a role;
- mark ready;
- select manifesto priorities;
- propose, reject, accept or counter a deal;
- expose a deal;
- submit an event decision;
- react to a candidate;
- endorse or withdraw;
- cast a ballot;
- submit the final allocation.

The client never calculates or directly writes authoritative outcomes.

## 19.3 Timed state machine

Scheduled reducers control:

- round deadlines;
- candidate-choice reveal;
- movement to broker reactions;
- deal lock;
- opening and closing ballots;
- result reveal.

No player acts as the host responsible for advancing the match.

## 19.4 Private information

Private objectives, deals, relationship states, hidden decisions and ballots are never published as globally readable state during the campaign.

Identity-aware views or visibility rules expose only the rows each authenticated player may see.

The server uses `ctx.sender` as the authoritative player identity. A client cannot:

- act as another role;
- inspect another player’s private deal;
- cast multiple ballots;
- modify a locked decision;
- allocate more than ₹100L.

## 19.5 Realtime subscriptions

Clients subscribe to the shared campaign state and their authorized private state.

This powers:

- deals appearing instantly for the intended broker;
- endorsement changes appearing on every screen;
- both candidate choices revealing simultaneously;
- event consequences updating the shared feed;
- ballots remaining hidden until one atomic reveal;
- final allocation and scores appearing for everyone together.

## 19.6 Deterministic simulation

Event consequences and scoring are authored rules executed in reducers.

SpacetimeDB does not infer whether an action was persuasive. It evaluates structured facts:

- selected policy;
- broker reaction;
- current relationship;
- accepted deal;
- public endorsement;
- final ballot;
- final committee allocation;
- selected flagship project;
- triggered red-line flags.

No LLM is required for game logic.

## 19.7 Demonstration sequence

The clearest sponsor demonstration is:

1. Candidate privately offers Culture ₹30L.
2. Only Culture receives the deal card.
3. Culture accepts and becomes Allied.
4. Culture publicly endorses the candidate; every browser updates.
5. Both candidates submit hidden crisis decisions.
6. The timer closes; both decisions reveal atomically.
7. Culture withdraws support after the candidate accepts a curfew.
8. Five private ballots are submitted and reveal together.
9. The winner allocates only ₹15L to Culture.
10. Culture’s failed objective and betrayed deal appear on all result screens.

Removing SpacetimeDB would remove the private information, authoritative timers, simultaneous reveals, synchronized political state, and final resolution. It is therefore inseparable from the game.

---

## 20. Conceptual Data Model

This section defines responsibilities, not implementation syntax.

### Public match state

- Room
- Player and claimed role
- Match phase and deadline
- Candidate profile and public priorities
- Public endorsement
- Current campaign event
- Revealed candidate response
- Broker public reaction
- Persistent campus fact
- Campus feed entry
- Election result
- Final allocation
- Final player result

### Private match state

- Broker objective and red line
- Candidate–broker relationship
- Private deal and counteroffer
- Hidden candidate response
- Hidden ballot

### Scheduled state

- Phase deadline
- Reveal task
- Election close

---

## 21. Conceptual Reducers

### Lobby

- Create or join room
- Claim role
- Mark ready
- Start match

### Manifesto and negotiation

- Select public priorities
- Propose deal
- Counter deal
- Accept deal
- Reject deal
- Expose deal

### Campaign events

- Submit candidate response
- Resolve response reveal
- Submit broker reaction
- Publicly endorse candidate
- Withdraw endorsement
- Advance round

### Election

- Cast secret ballot
- Close and reveal election

### Government formation

- Submit final budget and flagship project
- Calculate broker scores
- Resolve deals
- Publish final results

All validation and state transitions occur inside these reducers.

---

## 22. Client and Server Responsibilities

## Client

- Connect authenticated identity
- Subscribe to permitted public and private state
- Render cards, feed, timers and results
- Collect structured player choices
- Invoke reducers
- Animate received state transitions

The client does not:

- determine event consequences;
- calculate scores;
- reveal hidden decisions;
- decide phase transitions;
- enforce budget totals;
- infer authorization.

## SpacetimeDB module

- Own match state and timers
- Validate identity and role permissions
- Store public and private information
- Resolve authored event consequences
- Update relationships
- Enforce deal and endorsement rules
- Protect secret ballots
- Validate the ₹100L allocation
- Calculate all final outcomes

---

## 23. Explicitly Cut from the MVP

- AI agents or conversational NPCs
- Large audience or constituency mode
- Fabricated rumours
- Rumour verification
- Open-ended private chat
- LLM judgment of speeches
- LLM-generated events
- Candidate Momentum or numerical Credibility
- Numerical Trust
- Candidate Action Points
- Promise Ledger or aggregate promised-total meter
- Confidence vote
- Binding manifesto
- Pre-election budget lock
- Multiple simultaneous rooms if one stable room is sufficient for the demo
- Explorable campus map
- Player movement
- 3D graphics
- Dating mechanics
- Classes, grades and placement simulation
- Persistent campaign across multiple real-world days

These features must not be added until the complete core match works end to end.

---

## 24. Hackathon Build Priority

## Must work

1. Seven players join and receive correct roles.
2. Public and private information are separated correctly.
3. Candidates can submit hidden simultaneous choices.
4. Deals can be proposed, countered, accepted and exposed.
5. Relationships move between Open, Allied and Burned.
6. Endorsements update publicly in real time.
7. Three campaign events resolve under timers.
8. Five ballots remain secret and reveal correctly.
9. Winner allocates exactly ₹100L and one project.
10. Broker scores and deal betrayals resolve correctly.

## Should work

- Six-card random event deck
- One-by-one ballot animation
- Dynamic Final Soapbox summary
- Shareable results card
- Candidate ending labels

## Cut first if time runs out

1. Deal exposure
2. Random event selection; use a fixed three-event sequence
3. Counteroffers; retain propose, accept and reject
4. Candidate ending labels
5. Detailed feed copy
6. Non-essential animation

Do not cut:

- broker personal objectives;
- private deals;
- secret ballots;
- final allocation;
- realtime shared updates;
- server-authoritative phase resolution.

---

## 25. Suggested 12–13 Hour Execution Budget

This is a scope guard rather than a detailed implementation plan.

- **Hour 0–1:** Finalize schema and round state machine
- **Hour 1–4:** Build authoritative match, role, deal, event and relationship logic
- **Hour 4–5:** Generate bindings and verify module behaviour
- **Hour 5–8:** Build lobby and functional main game screen
- **Hour 8–10:** Build election, allocation and results
- **Hour 10–11:** Verify private visibility and simultaneous reveal
- **Hour 11–12:** Deploy, test with seven browser sessions and fix blockers
- **Remaining time:** Copy, minimal animation and demo rehearsal

The deployed core flow must be complete before visual polish begins.

---

## 26. Demo Script

The demo should use multiple browser windows or audience devices.

1. Show the seven occupied roles.
2. Candidate A sends a private deal to Sports.
3. Confirm no unrelated player can see it.
4. Sports accepts and publicly endorses Candidate A.
5. Trigger a campaign event.
6. Both candidates submit different hidden responses.
7. Show the simultaneous reveal across screens.
8. Let Sports disapprove and withdraw support.
9. Cast all five ballots.
10. Reveal the President.
11. Let the President allocate the budget.
12. Reveal that one decisive supporter was betrayed.

The judge should understand within one minute:

- every player has a personal agenda;
- private and public information coexist;
- human decisions control the election;
- the world reacts synchronously;
- the final allocation has consequences.

---

## 27. Success Criteria

The prototype succeeds if:

- candidates genuinely negotiate because votes cannot be calculated automatically;
- brokers care about outcomes beyond identifying the likely winner;
- at least one alliance changes during a typical match;
- private information creates uncertainty without confusing the rules;
- the final allocation produces an understandable emotional reaction;
- all players see public changes without refreshing;
- hidden information remains hidden until the intended reveal;
- the complete match reliably finishes in approximately 14 minutes;
- SpacetimeDB is visibly responsible for the core experience.

---

## 28. Final Locked Product Statement

> **Kingmaker is a 14-minute realtime social strategy game set during a student election at an elite fictional Indian college. Two candidates compete for five committee-head votes by responding to campus events and negotiating private deals. Every committee head has a public constituency, private agenda, red line and personal victory condition. Votes are secret, promises are non-binding, and the elected President’s final ₹100L allocation reveals which allies were rewarded and which were betrayed. SpacetimeDB owns the shared campaign, private information, timed reveals, relationships, ballots and final consequences, making every political action immediately real for every player.**

---

## 29. Design References

The setting is fictional, but its institutional structure is informed by publicly documented Indian campus governance:

- [IIM Ahmedabad Student Council](https://www.iima.ac.in/student-life/student-council)
- [IIM Indore PGP Students Activity Council](https://iimidr.ac.in/students-corner/student-body/pgp-sac/)
- [IIM Trichy Student Council](https://students.iimtrichy.ac.in/Student%20Council.html)
- [IIT Bombay Insight: Hostel Councils and Student Voices](https://insightiitb.org/hostel-councils-and-student-voices-the-need-for-clarity-and-accountability/)
- [IIT Kanpur Vox Populi: Campus Election Politics](http://voxiitk.com/democracy-of-the-people-by-the-people-for-the-people/)

The presentation takes inspiration from Status AI’s strengths:

- familiar social-interface language;
- immediate reactions to player actions;
- personal relationships and private information;
- a world that narrates player consequences back to them.

It does not copy Status AI’s social-network theme or depend on generative AI.
