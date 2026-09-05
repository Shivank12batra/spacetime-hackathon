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

async function main() {
  const seats = [
    { name: 'Meera', role: 'campus_star' },
    { name: 'Riya', role: 'culture' },
    { name: 'Dev', role: 'hostel' },
    { name: 'Ansh', role: 'placement' },
    { name: 'Shivank', role: 'welfare' },
  ];

  for (const seat of seats) {
    try {
      const conn = await connect();
      await call(conn, 'joinGame', { displayName: seat.name });
      await call(conn, 'claimRole', { role: seat.role });
      console.log(`seated ${seat.name} as ${seat.role}`);
    } catch (err) {
      console.log(`could not seat ${seat.role}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
