import { writable, derived } from 'svelte/store';

function createDbState() {
	const { subscribe, set } = writable('pending');

	return {
		subscribe,
		setError: () => set('error'),
		setPending: () => set('pending'),
		setReady: () => {
			set('ready');
		},
	};
}

export const dbState = createDbState();
export let isDbPending = derived(dbState, ($dbState) => $dbState === 'pending');
export let isDbReady = derived(dbState, ($dbState) => $dbState === 'ready');
export let isDbError = derived(dbState, ($dbState) => $dbState === 'error');
