import { chromium, type Page } from 'playwright';

const HOST = process.env.DEMO_HOST ?? 'https://campus-whispers-seven.vercel.app';

type Bot = {
  as: string;
  join: string;
  role: string;
  lean: 'builder' | 'campus_star';
};

const RUN = Date.now();
const BOTS: Bot[] = [
  { as: `live-sp-${RUN}`, join: 'Rhea', role: 'sports', lean: 'builder' },
  { as: `live-cu-${RUN}`, join: 'Mira', role: 'culture', lean: 'campus_star' },
  { as: `live-hm-${RUN}`, join: 'Dev', role: 'hostel', lean: 'builder' },
  { as: `live-pa-${RUN}`, join: 'Ishaan', role: 'placement', lean: 'builder' },
  { as: `live-sw-${RUN}`, join: 'Noor', role: 'welfare', lean: 'campus_star' },
];

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function clickNamed(page: Page, name: string | RegExp, timeout = 2500) {
  try {
    const button = page.getByRole('button', { name }).first();
    if (!(await button.count())) return false;
    if (await button.isDisabled().catch(() => true)) return false;
    await button.click({ timeout });
    return true;
  } catch {
    return false;
  }
}

async function skipIntro(page: Page, bot: Bot) {
  for (let i = 0; i < 10; i += 1) {
    if (await clickNamed(page, /Go to registration|Sign in|Seal my role|Open election night/i, 800)) break;
    if (!(await clickNamed(page, /Next notice/i, 800))) break;
    await sleep(250);
  }
  const nameBox = page.getByPlaceholder(/Kabir or Priya/i);
  if (await nameBox.count()) {
    await nameBox.fill(bot.join);
    await clickNamed(page, /Sign in/i, 3000);
    await sleep(800);
  }
}

async function phaseOf(page: Page) {
  try {
    const marker = page.locator('[data-phase]').first();
    if (!(await marker.count())) return 'lobby';
    return (await marker.getAttribute('data-phase', { timeout: 800 })) ?? 'lobby';
  } catch {
    return 'lobby';
  }
}

async function stageOf(page: Page) {
  try {
    const marker = page.locator('[data-stage]').first();
    if (!(await marker.count())) return '';
    return (await marker.getAttribute('data-stage', { timeout: 800 })) ?? '';
  } catch {
    return '';
  }
}

async function takeCouncilActions(page: Page, bot: Bot, phase: string, stage: string, acted: Set<string>) {
  const key = `${phase}:${stage}`;
  if (acted.has(key)) return;
  await clickNamed(page, /I understand my mandate/i, 1500);

  if (phase === 'lobby' || !phase) {
    await clickNamed(page, /Seal my role/i, 2500);
    return;
  }

  if (phase === 'manifesto') {
    await clickNamed(page, /^deals$/i, 1500);
    await clickNamed(page, /Send private note/i, 2500);
    await clickNamed(page, /^relations$/i, 1200);
    await clickNamed(page, /Endorse/i, 1500);
    acted.add(key);
    console.log(`${bot.join} recorded a private offer / endorsement on manifesto night`);
    return;
  }

  if ((phase === 'everyday' || phase === 'opportunity' || phase === 'values') && stage === 'reaction') {
    const helps = page.locator('button.cw-btn:not(:disabled)', { hasText: bot.lean === 'builder' ? 'Helps us' : 'Burns us' });
    const count = await helps.count();
    if (count === 0) {
      const fallback = page.locator('button.cw-btn:not(:disabled)', { hasText: 'Helps us' });
      const n = await fallback.count();
      for (let i = 0; i < n; i += 1) {
        await page.locator('button.cw-btn:not(:disabled)', { hasText: 'Helps us' }).first().click({ timeout: 1500 }).catch(() => {});
      }
    } else {
      for (let i = 0; i < count; i += 1) {
        await page.locator('button.cw-btn:not(:disabled)', { hasText: bot.lean === 'builder' ? 'Helps us' : 'Burns us' }).first().click({ timeout: 1500 }).catch(() => {});
      }
    }
    acted.add(key);
    console.log(`${bot.join} stamped public reactions`);
    return;
  }

  if ((phase === 'everyday' || phase === 'opportunity' || phase === 'values') && stage !== 'reaction') {
    await clickNamed(page, /^deals$/i, 1200);
    await clickNamed(page, /Send private note/i, 2000);
    acted.add(key);
    console.log(`${bot.join} tabled a note during ${phase}`);
    return;
  }

  if (phase === 'soapbox') {
    await clickNamed(page, /^relations$/i, 1200);
    await clickNamed(page, /Endorse/i, 1500);
    acted.add(key);
    console.log(`${bot.join} took a public position at the rally`);
    return;
  }

  if (phase === 'election') {
    const vote = bot.lean === 'builder' ? /Vote Builder/i : /Vote Campus Star/i;
    if (await clickNamed(page, vote, 4000)) {
      acted.add(key);
      console.log(`${bot.join} cast a secret ballot`);
    }
    return;
  }
}

async function main() {
  console.log(`Joining ${HOST} as five committee heads.`);
  console.log('Leave The Builder and The Campus Star for you and your friend.');
  console.log('Start the night when all seven seats are sealed.\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
  });

  const seats: { page: Page; bot: Bot; acted: Set<string> }[] = [];
  for (const [index, bot] of BOTS.entries()) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 820 } });
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    await page.goto(
      `${HOST}/?as=${bot.as}&join=${encodeURIComponent(bot.join)}&role=${bot.role}&ready=1`,
      { waitUntil: 'domcontentloaded' }
    );
    await skipIntro(page, bot);
    await clickNamed(page, /Seal my role/i, 4000);
    seats.push({ page, bot, acted: new Set() });
    console.log(`window ${index + 1}: ${bot.join} → ${bot.role}`);
  }

  await sleep(2000);
  const lead = seats[0].page;
  const opening = await phaseOf(lead);
  if (opening && opening !== 'lobby') {
    console.log(`leftover match in ${opening} — returning to nominations`);
    await clickNamed(lead, /Return to nominations/i, 4000);
    await sleep(2000);
    for (const seat of seats) {
      await clickNamed(seat.page, /Seal my role/i, 3000);
    }
  }

  const started = Date.now();
  let sawPlay = false;
  while (Date.now() - started < 20 * 60_000) {
    for (const seat of seats) {
      if (seat.page.isClosed()) continue;
      const phase = await phaseOf(seat.page);
      const stage = await stageOf(seat.page);
      await takeCouncilActions(seat.page, seat.bot, phase, stage, seat.acted);
    }
    const sample = seats.find(seat => !seat.page.isClosed());
    const phase = sample ? await phaseOf(sample.page) : '';
    if (phase && phase !== 'lobby' && phase !== 'results') sawPlay = true;
    if (sawPlay && phase === 'results') {
      console.log('results reached — council windows stay open');
      break;
    }
    await sleep(2000);
  }

  await new Promise(() => {
    /* keep Chrome open */
  });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
