import { chromium, type Page } from 'playwright';
import { execSync } from 'node:child_process';

const HOST = process.env.DEMO_HOST ?? 'http://127.0.0.1:5174';
const USER_SEAT = 'sports';

type Bot = {
  as: string;
  join: string;
  role: string;
  kind: 'candidate' | 'head';
  lean: 'builder' | 'campus_star';
};

const BOTS: Bot[] = [
  { as: 'demo-builder', join: 'Aryan', role: 'builder', kind: 'candidate', lean: 'builder' },
  { as: 'demo-star', join: 'Meera', role: 'campus_star', kind: 'candidate', lean: 'campus_star' },
  { as: 'demo-culture', join: 'Riya', role: 'culture', kind: 'head', lean: 'campus_star' },
  { as: 'demo-hostel', join: 'Dev', role: 'hostel', kind: 'head', lean: 'builder' },
  { as: 'demo-placement', join: 'Ansh', role: 'placement', kind: 'head', lean: 'builder' },
  { as: 'demo-welfare', join: 'Priya', role: 'welfare', kind: 'head', lean: 'campus_star' },
];

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sql(query: string) {
  return execSync(`spacetime sql kingmaker -s local ${JSON.stringify(query)}`, { encoding: 'utf8' });
}

function matchPhase() {
  return sql('SELECT phase FROM match_state').match(/"([a-z_]+)"/)?.[1] ?? '';
}

function eventStage() {
  return sql('SELECT event_stage FROM match_state').match(/"([a-z_]+)"/)?.[1] ?? '';
}

function seatedRoles() {
  return [...sql("SELECT role FROM player WHERE role != ''").matchAll(/"([a-z_]+)"/g)].map(match => match[1]);
}

function readyCount() {
  return [...sql('SELECT ready FROM player').matchAll(/\btrue\b/gi)].length;
}

async function clickNamed(page: Page, name: string | RegExp, timeout = 2500) {
  try {
    await page.getByRole('button', { name }).first().click({ timeout });
    return true;
  } catch {
    return false;
  }
}

async function dismissDossier(page: Page) {
  await clickNamed(page, /I understand my mandate/i, 2500);
}

async function playPhase(page: Page, bot: Bot, phase: string, stage: string) {
  await dismissDossier(page);

  if (phase === 'manifesto' && bot.kind === 'candidate') {
    await clickNamed(page, /Pin manifesto/i, 3000);
  }

  if ((phase === 'everyday' || phase === 'opportunity' || phase === 'values') && stage === 'discussion' && bot.kind === 'candidate') {
    const option = page.locator('button.cw-option').nth(bot.role === 'builder' ? 0 : 1);
    if (await option.count()) await option.click({ timeout: 2000 }).catch(() => {});
    await clickNamed(page, /Seal response/i, 2000);
  }

  if ((phase === 'everyday' || phase === 'opportunity' || phase === 'values') && stage === 'reaction' && bot.kind === 'head') {
    const helps = page.locator('button.cw-btn:not(:disabled)', { hasText: 'Helps us' });
    const count = await helps.count();
    for (let i = 0; i < count; i += 1) {
      await page.locator('button.cw-btn:not(:disabled)', { hasText: 'Helps us' }).first().click({ timeout: 1500 }).catch(() => {});
    }
  }

  if (phase === 'election' && bot.kind === 'head') {
    await clickNamed(page, bot.lean === 'builder' ? /Vote Builder/i : /Vote Campus Star/i, 2500);
  }

  if (phase === 'allocation' && bot.kind === 'candidate') {
    await clickNamed(page, /Publish the government/i, 2500);
  }
}

async function main() {
  console.log('\nResetting lobby…');
  try {
    execSync('spacetime call kingmaker reset_match -s local', { stdio: 'inherit' });
  } catch {
    console.log('reset_match skipped — continuing');
  }

  console.log('\n========================================');
  console.log('YOUR SEAT: Sports Secretary');
  console.log(`Open ${HOST}/  →  take Sports  →  Seal my role`);
  console.log('Six Chrome windows will sit the other seats and play with you.');
  console.log('========================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
  });

  const seats = [];
  for (const [index, bot] of BOTS.entries()) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 820 },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(6000);
    await page.goto(
      `${HOST}/?as=${bot.as}&join=${encodeURIComponent(bot.join)}&role=${bot.role}&ready=1`,
      { waitUntil: 'domcontentloaded' }
    );
    seats.push({ page, bot });
    console.log(`opened window ${index + 1}: ${bot.join} → ${bot.role}`);
  }

  const lead = seats[0].page;
  const deadline = Date.now() + 4 * 60_000;
  while (Date.now() < deadline) {
    const seated = seatedRoles();
    if (seated.includes(USER_SEAT) && readyCount() >= 7) break;
    console.log(`waiting for Sports to be claimed and sealed… seated=${seated.join(',') || 'none'} ready=${readyCount()}`);
    await sleep(2500);
  }

  if (!seatedRoles().includes(USER_SEAT) || readyCount() < 7) {
    throw new Error('Sports was not sealed in time. Claim Sports and press Seal my role, then re-run.');
  }

  if (matchPhase() === 'lobby') {
    await clickNamed(lead, /Open election night/i, 5000);
    await sleep(1200);
  }

  console.log(`match live in ${matchPhase()}`);
  for (const seat of seats) await dismissDossier(seat.page);

  let last = '';
  const started = Date.now();
  while (Date.now() - started < 14 * 60_000) {
    const phase = matchPhase();
    const stage = eventStage();
    const key = `${phase}:${stage}`;
    if (!phase) {
      await sleep(400);
      continue;
    }
    if (phase === 'results') {
      console.log('results reached — Chrome windows stay open');
      break;
    }
    if (key !== last) {
      last = key;
      console.log(`phase → ${phase}${stage ? ` / ${stage}` : ''}`);
      await sleep(1200);
      await Promise.all(seats.map(seat => playPhase(seat.page, seat.bot, phase, stage)));
      await sleep(5000);
      if (matchPhase() === phase && eventStage() === stage) {
        await lead.evaluate(() => (window as unknown as { __campusWhispersAdvance?: () => void }).__campusWhispersAdvance?.());
      }
    } else {
      await sleep(500);
    }
  }

  await new Promise(() => {
    /* keep headed Chrome open */
  });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
