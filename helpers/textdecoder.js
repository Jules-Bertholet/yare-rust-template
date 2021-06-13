export class TextDecoder {
	constructor(utfLabel, options) {
		if (!["unicode-1-1-utf-8", "utf-8", "utf8"].includes(utfLabel)) {
			throw new Error(`Unsupported encoding ${utfLabel}`);
		}
	}

	decode(bytes) {
		return Buffer.from(bytes, bytes.byteOffset, bytes.byteLength).toString('utf-8');
	}
}