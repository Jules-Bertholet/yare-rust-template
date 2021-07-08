'use strict';

const fs = require("fs");
const TOML = require('@iarna/toml');
const { execSync } = require('child_process');
const process = require("process");

const isDevMode = process.env.NODE_ENV === 'development';

function findReplace(file, ...findReplacePairs) {
	let result = fs.readFileSync(file).toString();
	findReplacePairs.forEach(pair => {
		result = result.replace(pair[0], pair[1]);
	});
	fs.writeFileSync(file, result);
}


const orig_load = 
`async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("\`WebAssembly.instantiateStreaming\` failed because your server does not serve wasm with \`application/wasm\` MIME type. Falling back to \`WebAssembly.instantiate\` which is slower. Original error:\\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}`

module.exports.build = function () {
	console.log("Compiling Rust to WASM...");

	const projectName = TOML.parse(fs.readFileSync('./Cargo.toml').toString()).package.name;
	const wasmDir = `./target/wasm-pack/${projectName}`

	execSync(`cargo build --lib ${isDevMode ? '' : '--release'} --target wasm32-unknown-unknown --color always`);
	execSync(`wasm-bindgen ./target/wasm32-unknown-unknown/${isDevMode ? 'debug' : 'release'}/${projectName.replace(/-/g, '_')}.wasm --out-dir ${wasmDir} --typescript --target web --out-name index`);
	if (!isDevMode) {
		execSync(`wasm-opt ${wasmDir}/index_bg.wasm -o ${wasmDir}/index_bg.wasm-opt.wasm -O4`);
		fs.renameSync(`${wasmDir}/index_bg.wasm-opt.wasm`, `${wasmDir}/index_bg.wasm`);
	}
	console.log("Rust compiled to WASM successfully!");

	fs.writeFileSync('./Cargo.toml.d.ts', `
type Exports = typeof import("${wasmDir}/index");
declare const exports: () => Exports;
export default exports;`
	);

	findReplace(`${wasmDir}/index.js`,
		['async function init(input) {', 'function init(input) {'],
		['const { instance, module } = await load(await input, imports);', 'const { instance, module } = load(input, imports);'],
		[
			orig_load,
`function load(module, imports) {
    const date = "${Date.now()}";
    if (typeof memory === "undefined") {
        globalThis.memory = {};
    }
    if (true || !date === memory.__wasmCompileDate || !memory.__compiledModule) {
        memory.__wasmCompileDate = date;
        memory.__compiledModule = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(memory.__compiledModule, imports);
    return { instance, module };
}`
		]
	);

	findReplace(`${wasmDir}/index.d.ts`,
		['InitInput | Promise<InitInput>', 'InitInput'],
		['Promise<InitOutput>', 'InitOutput'],
		['InitInput | Promise<InitInput>', 'InitInput'],
		['Promise<InitOutput>', 'InitOutput']
	);
}

