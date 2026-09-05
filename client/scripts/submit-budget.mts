import { DbConnection } from '../src/module_bindings';

function connect(token?: string): Promise<DbConnection> {
  return new Promise((resolve, reject) => {
    let builder = DbConnection.builder()
      .withUri('http://127.0.0.1:3000')
      .withDatabaseName('kingmaker')
      .onConnect(connection => resolve(connection))
      .onConnectError((_ctx, error) => reject(error));
    if (token) builder = builder.withToken(token);
    builder.build();
  });
}

async function main() {
  // Let's connect as ansh (builder)
  // We can find ansh's token or claim role
  const conn = await connect();
  // Call joinGame & claimRole or we can inspect tokens
  // If match is in allocation, submitAllocation can be called by winner
  console.log('connected');
}

main().catch(console.error);
