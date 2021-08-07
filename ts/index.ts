import wasm from "../Cargo.toml";
import RenderService from 'yare-code-sync/client/RenderService';

// Override `my_spirits` declaration to be specific to the shape you play.
// Also set corresponding feature in `Cargo.toml`
declare const my_spirits: CircleSpirit[]; 

// You code here
const instance = wasm(); // Instantiate the WebAssembly module
instance.example_fn(my_spirits[0]);
RenderService.log("Hello world from TS using RenderService!");
