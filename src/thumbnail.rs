use std::io::Cursor;

use crate::utils::set_panic_hook;
use image::{ImageFormat, ImageReader};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct ImageThumbnail {
    data: Vec<u8>,
}

#[wasm_bindgen]
impl ImageThumbnail {
    #[wasm_bindgen(constructor)]
    pub fn new(size: usize) -> Self {
        Self {
            data: Vec::with_capacity(size),
        }
    }

    #[wasm_bindgen(getter)]
    pub fn ptr(&self) -> *const u8 {
        self.data.as_ptr()
    }

    #[wasm_bindgen]
    pub fn thumbnail(&self, width: u32, height: u32) -> Result<ResultImage, JsValue> {
        set_panic_hook();

        let img = ImageReader::new(Cursor::new(&self.data))
            .decode()
            .map_err(|e| e.to_string())?;
        let thumbnail = img.thumbnail(width, height);

        let mut w = Cursor::new(Vec::new());
        thumbnail
            .write_to(&mut w, ImageFormat::Jpeg)
            .map_err(|e| e.to_string())?;

        Ok(ResultImage::new(w.into_inner()))
    }
}

#[wasm_bindgen]
pub struct ResultImage {
    data: Vec<u8>,
}

#[wasm_bindgen]
impl ResultImage {
    #[wasm_bindgen(constructor)]
    pub fn new(data: Vec<u8>) -> Self {
        Self { data }
    }

    #[wasm_bindgen(getter)]
    pub fn ptr(&self) -> *const u8 {
        self.data.as_ptr()
    }

    #[wasm_bindgen(getter)]
    pub fn size(&self) -> usize {
        self.data.len()
    }
}
