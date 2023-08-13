<script>
	import { checkpointRepository } from '$lib/backend';
	import { getCurrentTabUrl } from '$lib/chrome';
	import { Checkpoint } from '$lib/entity/checkpoint';
	import { onMount } from 'svelte';
	import CheckpointItem from './checkpoint-item.svelte';
	import { Pin } from 'lucide-svelte';

	/** @type {Array<import('$lib/entity/checkpoint').Checkpoint>} */
	export let checkpoints = [];

	let checkpoint = new Checkpoint();
	$: enableSave = checkpoint.name !== '';

	/**
	 * @type {HTMLInputElement}
	 */
	let inputDom;

	onMount(() => {
		inputDom.focus();
	});

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

<h2 class="card-title">My Pins</h2>
{#each checkpoints as checkpoint}
	<CheckpointItem bind:checkpoint on:delete={deleteCheckpoint} />
{/each}
<div class="join w-full mt-2">
	<input
		name="name"
		type="text"
		placeholder="What do your want to remember?"
		class="input input-bordered w-full max-w-lg mr-3"
		bind:value={checkpoint.name}
		bind:this={inputDom}
		on:keyup={async (e) => {
			if (e.key === 'Enter' && enableSave) {
				await addCheckpoint();
			}
		}}
	/>
	<button class="btn btn-square" on:click={addCheckpoint} disabled={!enableSave}>
		<Pin strokeWidth={1.25} />
	</button>
</div>

<style>
</style>
