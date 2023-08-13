<script>
	import { checkpointRepository } from '$lib/backend';
	import { getCurrentTabUrl } from '$lib/chrome';
	import { Checkpoint } from '$lib/entity/checkpoint';
	import CheckpointItem from './checkpoint-item.svelte';

	/** @type {Array<import('$lib/entity/checkpoint').Checkpoint>} */
	export let checkpoints = [];

	let checkpoint = new Checkpoint();

	async function addCheckpoint() {
		try {
			checkpoint.url = await getCurrentTabUrl();
			const data = await checkpointRepository.create(checkpoint);
			checkpoints = [...checkpoints, data];
			checkpoint = new Checkpoint();
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * @param {CustomEvent<{ id: string }>} event
	 */
	async function deleteCheckpoint(event) {
		try {
			const id = event.detail.id;
			await checkpointRepository.delete(id);
			checkpoints = checkpoints.filter((c) => c.id !== id);
		} catch (e) {
			console.error(e);
		}
	}
</script>

{#each checkpoints as checkpoint}
	<CheckpointItem bind:checkpoint on:delete={deleteCheckpoint} />
{/each}
<label>
	Name
	<input name="name" type="text" bind:value={checkpoint.name} />
</label>

<button on:click={addCheckpoint}>Add</button>

<style>
</style>
