/**
 * Store defines a transactional key/value store that Replicache stores all data
 * within.
 *
 * For correct operation of Replicache, implementations of this interface must
 * provide [strict
 * serializable](https://jepsen.io/consistency/models/strict-serializable)
 * transactions.
 *
 * Informally, read and write transactions must behave like a ReadWrite Lock -
 * multiple read transactions are allowed in parallel, or one write.
 * Additionally writes from a transaction must appear all at one, atomically.
 *
 * @experimental This interface is experimental and might be removed or changed
 * in the future without following semver versioning. Please be cautious.
 */
export interface Store {
  read(): Promise<Read>;
  write(): Promise<Write>;
  close(): Promise<void>;
}

/**
 * This interface is used so that we can release the lock when the transaction
 * is done.
 *
 * @experimental This interface is experimental and might be removed or changed
 * in the future without following semver versioning. Please be cautious.
 */
export interface Release {
  release(): void;
}

/**
 * @experimental This interface is experimental and might be removed or changed
 * in the future without following semver versioning. Please be cautious.
 */
export interface Read extends Release {
  has(key: string): Promise<boolean>;
  get(key: string): Promise<Uint8Array | undefined>;
}

/**
 * @experimental
 */
export interface Write extends Read {
  put(key: string, value: Uint8Array): Promise<void>;
  del(key: string): Promise<void>;
  commit(): Promise<void>;
}
