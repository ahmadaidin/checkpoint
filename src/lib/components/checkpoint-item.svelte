<script>
	import { checkpointRepository } from '$lib/backend';
	import { getCurrentTabUrl } from '$lib/chrome';
	/** @typedef {import('$lib/entity/checkpoint').Checkpoint} Checkpoint*/

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	/** @type {Checkpoint} */
	export let checkpoint;

	function dispatchDelete() {
		dispatch('delete', { id: checkpoint.id });
	}

	async function updateCheckpoint() {
		const checkpointTemp = checkpoint;
		try {
			checkpointTemp.url = await getCurrentTabUrl();
			await checkpointRepository.update(checkpointTemp);
			checkpoint.url = checkpointTemp.url;
		} catch (e) {
			console.error(e);
		}
	}
</script>

<div>
	<a href={checkpoint.url} target="_blank">{checkpoint.name}</a>
	<button on:click={dispatchDelete}>X</button><button on:click={updateCheckpoint}>Pin</button>
</div>

<style>
	/* styles go here */
</style>
