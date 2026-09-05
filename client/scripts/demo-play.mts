import { chromium, type BrowserContext, type Page } from 'playwright';
import { execSync } from 'node:child_process';

const HOST = process.env.DEMO_HOST ?? 'http://localhost:5176';
const USER_SEAT = 'sports';

type Bot = {
  as: string;
  join: string;
  role: string;
  kind: 'candidate' | 'head';
  lean: 'builder' | 'campus_star';
  seatLabel: string;
  priorities?: [string, string];
};

const BOTS: Bot[] = [
  {
    as: 'demo-builder',
    join: 'Aryan',
    role: 'builder',
    kind: 'candidate',
    lean: 'builder',
    seatLabel: 'The Builder',
    priorities: ['Sports', 'Hostel'],
  },
  {
    as: 'demo-star',
    join: 'Meera',
    role: 'campus_star',
    kind: 'candidate',
    lean: 'campus_star',
    seatLabel: 'The Campus Star',
    priorities: ['Culture', 'Student'],
  },
  {
    as: 'demo-culture',
    join: 'Riya',
    role: 'culture',
    kind: 'head',
    lean: 'campus_star',
    seatLabel: 'Cultural',
  },
  {
    as: 'demo-hostel',
    join: 'Dev',
    role: 'hostel',
    kind: 'head',
    lean: 'builder',
    seatLabel: 'Hostel',
  },
  {
    as: 'demo-placement',
    join: 'Ansh',
    role: 'placement',
    kind: 'head',
    lean: 'builder',
    seatLabel: 'Placement',
  },
  {
    as: 'demo-welfare',
    join: 'Priya',
    role: 'welfare',
    kind: 'head',
    lean: 'campus_star',
    seatLabel: 'Student',
  },
];

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sql(query: string) {
  return execSync(`spacetime sql kingmaker -s local ${JSON.stringify(query)}`, {
    encoding: 'utf8',
  });
}

function matchPhase() {
  const out = sql('SELECT phase FROM match_state');
  return out.match(/"([a-z_]+)"/)?.[1] ?? '';
}

function seatedRoles() {
  const out = sql("SELECT role FROM player WHERE role != ''");
  return [...out.matchAll(/"([a-z_]+)"/g)].map(match => match[1]);
}

async function clickNamed(page: Page, name: string | RegExp, timeout = 1800) {
  try {
    await page.getByRole('button', { name }).first().click({ timeout });
    return true;
  } catch {
    return false;
  }
}

async function dismissCinema(page: Page) {
  if (page.isClosed()) return;
  for (let i = 0; i < 3; i += 1) {
    try {
      const overlay = page.locator('.storyteller-overlay');
      if (await overlay.count()) {
        await overlay.click({ timeout: 400 }).catch(() => {});
      }
      await clickNamed(page, 'TAP TO CONTINUE', 250);
      await clickNamed(page, 'CONTINUE', 250);
      await clickNamed(page, 'ENTER THE CHAMBER', 250);
    } catch {
      return;
    }
  }
}

async function phaseOf(page: Page) {
  const fromDom = await page.locator('[data-phase]').getAttribute('data-phase');
  return fromDom || matchPhase();
}

async function joinAndClaim(context: BrowserContext, bot: Bot) {
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  await page.addInitScript(() => {
    sessionStorage.setItem('km_brief', '1');
  });
  await page.goto(
    `${HOST}/?as=${bot.as}&join=${encodeURIComponent(bot.join)}&role=${bot.role}`,
    { waitUntil: 'domcontentloaded' }
  );
  await page.waitForTimeout(1600);
  await dismissCinema(page);

  const nameBox = page.getByPlaceholder(/Kabir or Priya/i);
  if (await nameBox.count()) {
    await nameBox.fill(bot.join);
    await clickNamed(page, 'JOIN', 3000);
    await page.waitForTimeout(600);
  }

  const seat = page.locator('.ticket-card, .head-lobby-card').filter({ hasText: bot.seatLabel }).first();
  try {
    await seat.click({ timeout: 2500 });
  } catch {
    /* URL auto-claim may already have seated this identity */
  }
  console.log(`opened ${bot.join} → ${bot.role}`);
  return { page, bot };
}

async function playPhase(page: Page, bot: Bot, phase: string) {
  await dismissCinema(page);
  await clickNamed(page, /ACCEPT PACT/i, 500);

  if (phase === 'manifesto') {
    if (bot.kind === 'candidate' && bot.priorities) {
      for (const label of bot.priorities) {
        await page.locator('button').filter({ hasText: label }).first().click({ timeout: 2000 }).catch(() => {});
      }
      await clickNamed(page, /CONFIRM MANIFESTO PILLARS/i, 2000);
    } else {
      const face = bot.lean === 'builder' ? 'The Builder' : 'The Campus Star';
      await page.locator('button').filter({ hasText: face }).first().click({ timeout: 1500 }).catch(() => {});
      await clickNamed(page, /PUBLIC ENDORSEMENT/i, 1200);
      await clickNamed(page, /PROPOSE PACT/i, 1200);
    }
  }

  if (phase === 'everyday' || phase === 'opportunity' || phase === 'values') {
    if (bot.kind === 'candidate') {
      const door = page.locator('.decision-door-btn').first();
      try {
        await door.waitFor({ state: 'visible', timeout: 6000 });
        await door.click();
      } catch {
        /* door already locked or overlay still up */
      }
    } else {
      await clickNamed(page, 'APPROVE', 1200);
      await clickNamed(page, 'APPROVE', 1200);
    }
  }

  if (phase === 'soapbox' && bot.kind === 'head') {
    const face = bot.lean === 'builder' ? /The Builder/i : /The Campus Star/i;
    await clickNamed(page, face, 1000);
    await clickNamed(page, /PUBLIC ENDORSEMENT/i, 1000);
    await clickNamed(page, /PROPOSE PACT/i, 1000);
  }

  if (phase === 'election' && bot.kind === 'head') {
    const vote = bot.lean === 'builder' ? /VOTE FOR THE BUILDER/i : /VOTE FOR THE CAMPUS STAR/i;
    await clickNamed(page, vote, 2000);
  }

  if (phase === 'allocation') {
    await clickNamed(page, /PUBLISH OFFICIAL MANDATE/i, 1500);
  }
}

async function advance(page: Page) {
  await dismissCinema(page);
  await clickNamed(page, 'ADVANCE', 1500);
}

async function main() {
  console.log('\n========================================');
  console.log('YOUR SEAT: Sports Secretary');
  console.log('Refresh http://localhost:5176/ and TAKE SEAT on Sports.');
  console.log('Six Chrome tabs will sit the other roles and play every round.');
  console.log('========================================\n');

  const context = await chromium.launchPersistentContext('/tmp/poster-war-demo-chrome', {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1280, height: 820 },
    args: ['--window-size=1440,900'],
  });

  const seats = await Promise.all(BOTS.map(bot => joinAndClaim(context, bot)));
  const lead = seats[0].page;

  const deadline = Date.now() + 180_000;
  while (matchPhase() === 'lobby' && !seatedRoles().includes(USER_SEAT)) {
    if (Date.now() > deadline) {
      throw new Error('Sports was not claimed in time. Take Sports in your tab, then re-run.');
    }
    console.log('waiting for you to take Sports Secretary…');
    await sleep(2000);
  }

  if (matchPhase() === 'lobby') {
    await dismissCinema(lead);
    await clickNamed(lead, /COMMENCE ELECTION/i, 4000);
    await sleep(800);
  }

  if (matchPhase() === 'lobby') {
    throw new Error('match is still in lobby — take Sports, then I can commence');
  }
  console.log(`match live in ${matchPhase()} — bots playing each round`);

  let last = '';
  const started = Date.now();
  while (Date.now() - started < 12 * 60_000) {
    const phase = matchPhase() || (await phaseOf(lead));
    if (!phase) {
      await sleep(400);
      continue;
    }
    if (phase === 'results') {
      console.log('aftermath reached — Chrome tabs stay open');
      break;
    }

    if (phase !== last) {
      last = phase;
      console.log(`phase → ${phase}`);
      const live = seats.filter(seat => !seat.page.isClosed());
      await Promise.all(live.map(seat => dismissCinema(seat.page)));
      await sleep(1800);
      await Promise.all(live.map(seat => playPhase(seat.page, seat.bot, phase)));
      if (phase === 'reveal') {
        for (let i = 0; i < 8; i += 1) {
          await sleep(1500);
          await advance(lead);
          if (matchPhase() !== 'reveal') break;
        }
        continue;
      }
      await sleep(11_000);
      if (matchPhase() === phase) {
        await advance(lead);
      }
    } else {
      await sleep(400);
    }
  }

  await new Promise(() => {
    /* keep headed Chrome open for the demo */
  });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
