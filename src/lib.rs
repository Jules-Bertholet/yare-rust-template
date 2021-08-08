use std::convert::TryFrom;

use wasm_bindgen::prelude::*;
use yareio_sys::prelude::*;

// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// When the `qimalloc` feature is enabled, this uses `qimalloc` as the global
// allocator.
#[cfg(feature = "qimalloc")]
#[global_allocator]
static ALLOC: qimalloc::QIMalloc = qimalloc::QIMalloc::INIT;

// This is like the `main` function; it is run when the WebAssembly module is instantiated.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    // This provides better error messages in debug mode.
    // It's disabled in release mode so it doesn't bloat up the file size.
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    // Your code goes here!
    log!("Hello world from Rust!");

    render_service::log("Hello world from Rust using RenderService!"); // Use yare-code-sync to log to the console

    // Iterates over all the spirits in `my_spirits`, and moves those that are operable to [1000.0, 1000.0].
    my_spirits()
        .iter()
        .filter_map(|s| TryFrom::<&Spirit>::try_from(s).ok())
        .for_each(|s: &OperableSpirit| s.move_to_pos(&[1000.0, 1000.0]));

    Ok(())
}

// This function can be called from JS.
#[wasm_bindgen]
pub fn example_fn(a: OperableSpirit) {
    log!(a.shape()); // Log the provided spirit's shape
    graphics::set_style("test");
    graphics::rect(&[1.0, 1.0], &[100.0, 100.0]); // Draw a square on the canvas
    a.shout("Mwahahah"); // Make the provided spirit shout "Mwahahah"
}
