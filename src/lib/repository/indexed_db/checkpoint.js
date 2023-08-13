import { dbState } from '../../store.js';
import { browser } from '$app/environment';
import { CHECKPOINT_DB_STORE, DB_NAME } from '../../const.js';
// import type { WriteResponse } from '$lib/entity/message.js';

/**
 * CheckpointRepostitory
 * @class
 * @constructor
 * @public
 * @implements {repository.ICheckpointRepository}
 * @property {IDBOpenDBRequest} dbRequest
 * @property {IDBDatabase} db
 }}
 */
export class CheckpointRepostitory {
	#db;

	constructor() {
		/** @type {IDBOpenDBRequest} */
		let request;

		/** @type {IDBDatabase} */
		let db;

		if (browser) {
			if (window.indexedDB) {
				console.log('IndexedDB is supported');
				request = indexedDB.open(DB_NAME, 1);
				if (!request) {
					alert('Failed to open database');
				} else {
					request.onerror = (event) => {
						console.error('Please allow the app to use IndexedDB!', event.target);
						dbState.setError();
					};

					request.onsuccess = (event) => {
						console.info('Database opened successfully!', event.target);
						dbState.setReady();
						// @ts-ignore
						this.#db = event.target?.result;
					};

					request.onupgradeneeded = (event) => {
						// @ts-ignore
						this.#db = event.target?.result;
						this.#db.createObjectStore(CHECKPOINT_DB_STORE, { keyPath: 'id', autoIncrement: true });
					};
				}
			} else {
				alert('Indexed DB is not supported!');
			}
		}
		// @ts-ignore
		// @ts-ignore
		this.#db = db;
	}

	/**
	 * @param {import('$lib/entity/checkpoint').Checkpoint} checkpoint
	 * @return {Promise<import('$lib/entity/checkpoint').Checkpoint>}
	 */
	create = async (checkpoint) => {
		checkpoint.lastUpdated = new Date();
		const transaction = this.#db.transaction(CHECKPOINT_DB_STORE, 'readwrite');
		if (!transaction) {
			throw new Error('Transaction is null');
		}
		const objectStore = transaction.objectStore(CHECKPOINT_DB_STORE);

		return new Promise((resolve, reject) => {
			/** @param {Event} event */
			transaction.onerror = (event) => {
				// Don't forget to handle errors!
				// @ts-ignore
				reject('Transaction error:', event.target?.errorCode);
			};

			const req = objectStore.add(checkpoint);
			req.onsuccess = (event) => {
				// @ts-ignore
				const id = event.target?.result;
				checkpoint.id = id;
				resolve(checkpoint);
			};

			req.onerror = (event) => {
				// @ts-ignore
				const error = event.target?.error;
				reject(error);
			};
		});
	};

	/**
	 * @param {string} checkpointId
	 */
	get = async (checkpointId) => {
		return new Promise((resolve, reject) => {
			console.log(checkpointId);
		});
	};

	/**
	 * @return {Promise<Array<import('$lib/entity/checkpoint').Checkpoint>>}
	 */
	list = async () => {
		console.log('get checkpoint list');
		/** @type {Array<import('$lib/entity/checkpoint').Checkpoint>} */
		const checkpoints = [];
		// return new Promise((resolve, reject) => {
		/** @type {IDBTransaction} */
		// @ts-ignore
		const transaction = this.#db.transaction(CHECKPOINT_DB_STORE, 'readonly');
		if (!transaction) {
			throw new Error('Transaction is null');
		}

		const objectStore = transaction.objectStore(CHECKPOINT_DB_STORE);

		return new Promise((resolve, reject) => {
			/** @param {Event} event */
			transaction.onerror = (event) => {
				// Don't forget to handle errors!
				// @ts-ignore
				reject('Transaction error:', event.target?.errorCode);
			};
			objectStore.openCursor().onsuccess = (event) => {
				// @ts-ignore
				const cursor = event.target?.result;
				if (cursor) {
					checkpoints.push(cursor.value);
					cursor.continue();
				} else {
					console.log('no more data');
					resolve(checkpoints);
				}
			};
		});
	};

	/**
	 *
	 * @param {import('$lib/entity/checkpoint').Checkpoint} checkpoint
	 */
	update = async (checkpoint) => {
		checkpoint.lastUpdated = new Date();
		const transaction = this.#db.transaction(CHECKPOINT_DB_STORE, 'readwrite');
		if (!transaction) {
			throw new Error('Transaction is null');
		}
		const objectStore = transaction.objectStore(CHECKPOINT_DB_STORE);

		return new Promise((resolve, reject) => {
			/** @param {Event} event */
			transaction.onerror = (event) => {
				// Don't forget to handle errors!
				// @ts-ignore
				reject('Transaction error:', event.target?.errorCode);
			};

			const req = objectStore.put(checkpoint);
			req.onsuccess = (event) => {
				// @ts-ignore
				resolve(true);
			};

			req.onerror = (event) => {
				// @ts-ignore
				const error = event.target?.error;
				reject(error);
			};
		});
	};

	/**
	 * @param {string} checkpointId
	 * @return {Promise<any>}
	 */
	delete = async (checkpointId) => {
		const transaction = this.#db.transaction(CHECKPOINT_DB_STORE, 'readwrite');
		if (!transaction) {
			throw new Error('Transaction is null');
		}
		const objectStore = transaction.objectStore(CHECKPOINT_DB_STORE);

		return new Promise((resolve, reject) => {
			/** @param {Event} event */
			transaction.onerror = (event) => {
				// Don't forget to handle errors!
				// @ts-ignore
				reject('Transaction error:', event.target?.errorCode);
			};

			const req = objectStore.delete(checkpointId);
			req.onsuccess = (event) => {
				// @ts-ignore
				resolve(true);
			};

			req.onerror = (event) => {
				// @ts-ignore
				const error = event.target?.error;
				reject(error);
			};
		});
	};
}
