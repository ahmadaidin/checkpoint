import { ulid } from 'ulid';

export class Checkpoint {
	/** @tyoe {string} */
	id;

	constructor() {
		const id = ulid();
		this.id = id;
		this.name = '';
		this.url = '';
	}
}
