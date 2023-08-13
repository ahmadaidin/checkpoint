<script>
	import { checkpointRepository } from '$lib/backend';
	import { getCurrentTabUrl } from '$lib/chrome';
	import { ArrowUpRightSquare, Pin, Trash2 } from 'lucide-svelte';
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

	$: lastUpdated = checkpoint.lastUpdated ? checkpoint.lastUpdated.toLocaleString() : '';
</script>

<div class="grid grid-cols-11 gap-0 mb-1">
	<div class="col-span-8 my-auto">
		<p class="text-base inline-block">{checkpoint.name}</p>
		<div class="badge badge-neutral badge-outline ml-1">{lastUpdated}</div>
	</div>
	<div class="flex col-span-1 justify-end tooltip" data-tip="open in new tab">
		<a class="inline-block" href={checkpoint.url} target="_blank">
			<button class="btn btn-info btn-square btn-md">
				<ArrowUpRightSquare strokeWidth={1.25} size={20} />
			</button>
		</a>
	</div>
	<div class="flex col-span-1 justify-end tooltip" data-tip="delete">
		<button class="btn btn-error btn-square btn-md" on:click={dispatchDelete}>
			<Trash2 strokeWidth={1.25} size={20} />
		</button>
	</div>
	<div class="flex col-span-1 justify-end tooltip" data-tip="pin current tab">
		<button class="btn btn-primary btn-square btn-md" on:click={updateCheckpoint}>
			<Pin strokeWidth={1.25} size={20} />
		</button>
	</div>
</div>

<style>
	/* styles go here */
</style>
