import { DbConnection } from '../src/module_bindings';

function connect(): Promise<DbConnection> {
  return new Promise((resolve, reject) => {
    const conn = DbConnection.builder()
      .withUri('http://127.0.0.1:3000')
      .withDatabaseName('kingmaker')
      .onConnect(connection => resolve(connection))
      .onConnectError((_ctx, error) => reject(error))
      .build();
  });
}

async function call(conn: DbConnection, name: string, args?: Record<string, unknown>) {
  const fn = (conn.reducers as Record<string, (value?: Record<string, unknown>) => Promise<void>>)[name];
  if (!fn) throw new Error(`missing reducer ${name}`);
  if (args) await fn(args);
  else await (fn as unknown as () => Promise<void>)();
}

async function claimFirst(conn: DbConnection, roles: string[]) {
  for (const role of roles) {
    try {
      await call(conn, 'claimRole', { role });
      return role;
    } catch (error) {
      if (String(error).includes('taken')) continue;
      throw error;
    }
  }
  throw new Error(`no open seats among ${roles.join(',')}`);
}

async function main() {
  const builder = await connect();
  const star = await connect();
  const brokers = await Promise.all([connect(), connect(), connect(), connect(), connect()]);

  await call(builder, 'joinGame', { displayName: 'VerifyBuilder' });
  await call(star, 'joinGame', { displayName: 'VerifyStar' });
  for (const [index, conn] of brokers.entries()) {
    await call(conn, 'joinGame', { displayName: `VerifyB${index}` });
  }

  const builderRole = await claimFirst(builder, ['builder', 'campus_star']);
  const starRole = await claimFirst(star, ['builder', 'campus_star'].filter(role => role !== builderRole));
  const openBrokers = ['culture', 'hostel', 'welfare', 'placement', 'sports'];
  const claimedBrokers: string[] = [];
  let dealBroker: DbConnection | null = null;
  let sportsRole = '';
  for (const conn of brokers) {
    try {
      const role = await claimFirst(conn, openBrokers.filter(role => !claimedBrokers.includes(role)));
      claimedBrokers.push(role);
      if (!dealBroker) {
        dealBroker = conn;
        sportsRole = role;
      }
    } catch {
      // seat already taken by a live tab
    }
  }
  if (!dealBroker || !sportsRole) throw new Error('no broker seat for the deal');
  const brokerA = dealBroker;

  await call(builder, 'startMatch');
  await call(builder, 'setPriorities', { priorityOne: 'sports', priorityTwo: 'welfare' });
  await call(brokerA, 'proposeDeal', {
    brokerRole: sportsRole,
    candidateRole: builderRole,
    promisedBudget: 25,
    promisedProject: 'carnival',
    requestedSupport: 'endorsement',
  });

  console.log(
    JSON.stringify({
      builderRole,
      starRole,
      dealFrom: sportsRole,
      dealTo: builderRole,
    })
  );
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
