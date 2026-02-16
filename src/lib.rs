pub(crate) mod utils;

mod thumbnail;

pub use thumbnail::*;

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
fn start() {
    utils::set_panic_hook();
}
