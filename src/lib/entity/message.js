export class WriteResponse {
	/**
	 * @param {boolean} success
	 * @param {Error} error
	 */
	constructor(success, error) {
		this.success = success;
		this.error = error;
	}
}
