use std::convert::TryFrom;

use js_sys::Float64Array;
use wasm_bindgen::prelude::*;
use web_sys::console;
use yare_bindings::{my_spirits, OperableSpirit, Spirit};

// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// This is like the `main` function; it is run when the WebAssembly module is instantiated.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    // This provides better error messages in debug mode.
    // It's disabled in release mode so it doesn't bloat up the file size.
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    // Your code goes here!
    console::log_1(&JsValue::from_str("Hello world!"));

    // Iterates over all the spirits in `my_spirits`, and moves those that are operable to [1000.0, 1000.0].
    my_spirits()
        .iter()
        .filter_map(|s| TryFrom::<&Spirit>::try_from(s).ok())
        .for_each(|s: &OperableSpirit| s.move_(&[1000.0, 1000.0]));

    Ok(())
}

// This function can be called from JS.
#[wasm_bindgen]
pub fn test_fn(a: OperableSpirit) {
    console::log_1(&(a.shape()).into()); // Log the provided spirit's shape
    console::log_1(&(Float64Array::from(a.position().as_ref())).into()); // Log the provided spirits's position
    a.shout("Mwahahah"); // Make the provided spirit shout "Mwahahah"
}
