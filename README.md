# Yare.io Rust Bot Template

This is a template for writing bots in Rust for [yare.io](https://yare.io/), a programming game where you use Javascript to control your game units (called "spirits") and try to kill the enemy base. The template uses `cargo`, `wasm-bindgen` and Rollup to compile your Rust to WASM, build a JS FFI, inline the WASM, and produce a single output file.

## Development

This template uses a Git submodule to store typings; you will need to clone the repo with `git clone --recurse-submodules`, or run `git submodule update --init` after cloning.

You will need to install dependencies. To install JS dependencies, install and run `yarn`. Cargo will install Rust dependencies for you on build; however, you'll need to install [Binaryen](https://github.com/WebAssembly/binaryen) and add `wasm-opt` to your PATH so your WASM can be optimized.

To build the bot, run `yarn build`. The result will be stored in `dist/bot.js`. Note that if there are any errors during linting or building, nothing is output (warnings don't prevent building). Tou build only the WASM and FFI, run `yarn build:rust` (the compiled WASM and generated bindings are under `targets/wasm-pack`).

Rust source code is stored under `src`. The entry point for the compiled WASM is `src/lib.rs`. TypeScript source code is under `ts`, with entry point `index.ts`. TypeScript types for Yare game objects are in `typings`. FFI Rust bindings are provided by the `yare-bindings` crate ([GitHub](https://github.com/Jules-Bertholet/yare-rust-bindings), [Rustdoc](https://jules-bertholet.github.io/yare-rust-bindings/yare_bindings/)).

If you want to use [`yare-code-sync`](https://github.com/arikwex/yare-code-sync), you have two options:

* `yarn serve` will serve `bot.js` with `yare-code-sync`.
* `yarn watch` will watch your source files for changes, and then continuously rebuild your bot. It will also launch `yare-code-sync` to serve the bundle file. Once again, no files are modified on error, so only valid code is sent to your browser.

All the above `yarn` commands can be modified with a `:dev` suffix (`yarn build:dev`) to build in development mode, which enables debug assertions and disables WASM optimisation and bundle minification.

To use `yare-code-sync`'s `RenderService`, place the following line at the top of your TypeScript source file:

```javascript
import RenderService from 'yare-code-sync/client/RenderService';
```

You can run `eslint` with `yarn lint`, or even use ESLint's autofix feature with `yarn lint:fix`.
