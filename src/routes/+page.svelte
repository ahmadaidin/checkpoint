<script>
	import { checkpointRepository } from '$lib/backend';
	import CheckpointList from '$lib/components/checkpoint-list.svelte';
	import { isDbReady } from '$lib/store';
	import { onMount } from 'svelte';

	/** @type {Array<import('$lib/entity/checkpoint').Checkpoint>} */
	let checkpoints = [];
	onMount(async () => {
		while (!$isDbReady) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
		console.debug('fetching checkpoints');
		try {
			checkpoints = await checkpointRepository.list();
			console.debug('got checkpoints', checkpoints);
		} catch (e) {
			console.error(e);
		}
	});
</script>

<svelte:head>
	<title>Checkpoint</title>
</svelte:head>

<CheckpointList {checkpoints} />
