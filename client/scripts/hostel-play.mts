import { chromium, type Page } from 'playwright';

const HOST = process.env.DEMO_HOST ?? 'https://campus-whispers-seven.vercel.app';
const JOIN = 'Dev';
const ROLE = 'hostel';
const AS = `live-hostel-${Date.now()}`;

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

async function skipIntro(page: Page) {
  for (let i = 0; i < 12; i += 1) {
    if (await clickNamed(page, /Go to registration|Sign in|Seal my role|Open election night/i, 800)) break;
    if (!(await clickNamed(page, /Next notice/i, 800))) break;
    await sleep(250);
  }
  const nameBox = page.getByPlaceholder(/Kabir or Priya/i);
  if (await nameBox.count()) {
    await nameBox.fill(JOIN);
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

async function hostelCard(page: Page) {
  return page.locator('[data-role="hostel"]').first();
}

async function inspectHostelSeat(page: Page) {
  const card = await hostelCard(page);
  if (!(await card.count())) {
    return { present: false, mine: false, disabled: false, ownerText: '', ready: false };
  }
  const mine = (await card.getAttribute('data-mine')) != null;
  const ready = (await card.getAttribute('data-ready')) != null;
  const disabled = await card.isDisabled().catch(() => false);
  const ownerText = ((await card.locator('.cw-role-owner').textContent().catch(() => '')) ?? '').trim();
  return { present: true, mine, disabled, ownerText, ready };
}

async function claimHostelOnly(page: Page) {
  const seat = await inspectHostelSeat(page);
  if (!seat.present) {
    console.log('STATUS seat=unknown reason=no-hostel-card');
    return 'unknown';
  }
  if (seat.mine) {
    await clickNamed(page, /Seal my role/i, 2500);
    console.log(`STATUS seat=claimed name=${JOIN} owner=${seat.ownerText} ready=${seat.ready}`);
    return 'claimed';
  }
  if (seat.disabled) {
    const leftover = /dev/i.test(seat.ownerText) && !/builder|campus star|asha|kabir/i.test(seat.ownerText);
    console.log(
      `STATUS seat=taken name=${JOIN} owner=${seat.ownerText} leftover=${leftover} — not stealing a candidate seat`
    );
    return leftover ? 'taken-leftover' : 'taken';
  }
  const card = await hostelCard(page);
  await card.click({ timeout: 4000 }).catch(() => {});
  await sleep(600);
  await clickNamed(page, /Seal my role/i, 2500);
  const after = await inspectHostelSeat(page);
  if (after.mine) {
    console.log(`STATUS seat=claimed name=${JOIN} owner=${after.ownerText} ready=${after.ready}`);
    return 'claimed';
  }
  console.log(`STATUS seat=unclaimed name=${JOIN} owner=${after.ownerText}`);
  return 'unclaimed';
}

async function takeHostelActions(page: Page, phase: string, stage: string, acted: Set<string>) {
  const key = `${phase}:${stage}`;
  await clickNamed(page, /I understand my mandate/i, 1500);

  if (phase === 'lobby' || !phase) {
    await claimHostelOnly(page);
    return;
  }

  if (acted.has(key)) return;

  if (phase === 'manifesto') {
    await clickNamed(page, /^deals$/i, 1500);
    await clickNamed(page, /Send private note/i, 2500);
    await clickNamed(page, /^relations$/i, 1200);
    await clickNamed(page, /Endorse/i, 1500);
    acted.add(key);
    console.log('ACTION manifesto private note / endorse');
    return;
  }

  if ((phase === 'everyday' || phase === 'opportunity' || phase === 'values') && stage === 'reaction') {
    const stamps = page.locator('button.cw-btn:not(:disabled)', { hasText: 'Helps us' });
    const count = await stamps.count();
    for (let i = 0; i < count; i += 1) {
      await page.locator('button.cw-btn:not(:disabled)', { hasText: 'Helps us' }).first().click({ timeout: 1500 }).catch(() => {});
    }
    acted.add(key);
    console.log('ACTION stamped Helps us on candidate decisions');
    return;
  }

  if ((phase === 'everyday' || phase === 'opportunity' || phase === 'values') && stage !== 'reaction') {
    await clickNamed(page, /^deals$/i, 1200);
    await clickNamed(page, /Send private note/i, 2000);
    acted.add(key);
    console.log(`ACTION private note during ${phase}`);
    return;
  }

  if (phase === 'soapbox') {
    await clickNamed(page, /^relations$/i, 1200);
    await clickNamed(page, /Endorse/i, 1500);
    acted.add(key);
    console.log('ACTION rally endorse');
    return;
  }

  if (phase === 'election') {
    const body = ((await page.locator('body').innerText().catch(() => '')) ?? '').toLowerCase();
    const starProtected =
      /campus star/.test(body) &&
      /(hostel|mess|commons|repairs|night canteen|no compulsory fee)/.test(body) &&
      /(protected|defended|saved|funded hostel|hostel budget)/.test(body);
    const vote = starProtected ? /Vote Campus Star/i : /Vote Builder/i;
    if (await clickNamed(page, vote, 4000)) {
      acted.add(key);
      console.log(`ACTION voted ${starProtected ? 'Campus Star' : 'Builder'}`);
    }
  }
}

async function main() {
  console.log(`HOSTEL BOT joining ${HOST}`);
  console.log(`as=${AS} join=${JOIN} role=${ROLE}`);
  console.log('Leaving The Builder and The Campus Star for human players.');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 820 } });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  await page.goto(
    `${HOST}/?as=${AS}&join=${encodeURIComponent(JOIN)}&role=${ROLE}&ready=1`,
    { waitUntil: 'domcontentloaded' }
  );
  await skipIntro(page);
  const claim = await claimHostelOnly(page);
  const opening = await phaseOf(page);
  console.log(`STATUS phase=${opening} claim=${claim} window=open`);

  const started = Date.now();
  const acted = new Set<string>();
  let lastPhase = opening;
  while (Date.now() - started < 20 * 60_000) {
    if (page.isClosed()) {
      console.log('STATUS window closed unexpectedly');
      break;
    }
    const phase = await phaseOf(page);
    const stage = await stageOf(page);
    if (phase !== lastPhase) {
      console.log(`STATUS phase=${phase} stage=${stage} window=open`);
      lastPhase = phase;
    }
    await takeHostelActions(page, phase, stage, acted);
    if (phase === 'results') {
      console.log('STATUS results reached — Chrome stays open');
      break;
    }
    await sleep(2000);
  }

  console.log('STATUS play loop finished — Chrome stays open');
  await new Promise(() => {
    /* keep Chrome open */
  });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
