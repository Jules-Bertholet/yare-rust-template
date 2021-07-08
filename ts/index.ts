import wasm from "../Cargo.toml";
import RenderService from 'yare-code-sync/client/RenderService';

// You code here
const instance = wasm(); // Instantiate the WebAssembly module
instance.example_fn(my_spirits[0]);
RenderService.log("Hello world!");
