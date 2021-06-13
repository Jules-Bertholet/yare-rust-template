import auto from '@rollup/plugin-auto-install';
import rust from '@wasm-tool/rollup-plugin-rust';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import eslint from '@rollup/plugin-eslint';
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs';
import inject from '@rollup/plugin-inject';
import { terser } from 'rollup-plugin-terser'
const wasmBuild = require("./helpers/build");

const replaceOpts = {
	values: {},
	delimiters: ['', ''],
	preventAssignment: false
};

replaceOpts.values['console.warn'] = 'console.log';
replaceOpts.values['console.err'] = 'console.log';
replaceOpts.values['cachedTextDecoder.decode();'] = '';
replaceOpts.values['async'] = '';
replaceOpts.values['await'] = '';

export default {
	input: 'ts/index.ts',
	output: {
		file: 'dist/bot.js',
		format: 'iife'
	},
	plugins: [
		auto({ manager: "yarn" }),
		rust({
			inlineWasm: true,
			sync: true,
			command: wasmBuild.build
		}),
		inject({
			TextDecoder: ['../../../helpers/textcoders', 'TextDecoder'],
			TextEncoder: ['../../../helpers/textcoders', 'TextEncoder'],
		}),
		replace(replaceOpts),
		resolve(),
		eslint({
			throwOnError: true,
		}),
		commonjs(),
		typescript({
			abortOnError: true
		}),
		terser()
	]
};