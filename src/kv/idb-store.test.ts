import {b, runAll, TestStore} from './store-test-util.js';
import {dropStore, IDBStore} from './idb-store.js';
import {expect} from '@esm-bundle/chai';

async function newRandomIDBStore() {
  const name = `test-idbstore-${Math.random()}`;
  await dropStore(name);
  return new IDBStore(name);
}

runAll('idbstore', newRandomIDBStore);

test('dropStore', async () => {
  const name = `drop-store-${Math.random()}`;
  await dropStore(name);
  let idb = new IDBStore(name);
  let store = new TestStore(idb);

  // Write a value.
  await store.withWrite(async wt => {
    await wt.put('foo', b`bar`);
    await wt.commit();
  });

  // Verify it's there.
  await store.withRead(async rt => {
    expect(await rt.get('foo')).to.deep.equal(b`bar`);
  });

  // Drop db
  dropStore(name);

  // Reopen store, verify data is gone
  idb = new IDBStore(name);
  store = new TestStore(idb);
  await store.withRead(async rt => {
    expect(await rt.has('foo')).to.be.false;
  });
});
