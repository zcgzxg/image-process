use std::io::Cursor;

use image::{DynamicImage, ImageFormat, ImageReader};
use wasm_bindgen::prelude::*;

const SUPPORTED_FORMATS: &[ImageFormat] = &[ImageFormat::Png, ImageFormat::Jpeg];

#[wasm_bindgen]
pub struct Image {
    image: DynamicImage,
    format: ImageFormat,
}

#[wasm_bindgen]
impl Image {
    #[wasm_bindgen(constructor)]
    pub fn new(image_data: Vec<u8>) -> Result<Self, JsValue> {
        let reader = Cursor::new(image_data);
        let image = ImageReader::new(reader)
            .with_guessed_format()
            .map_err(|e| e.to_string())?;

        let format = match image.format() {
            Some(format) => {
                if !SUPPORTED_FORMATS.contains(&format) {
                    return Err(JsValue::from_str("Unsupported format"));
                }
                format
            }
            None => return Err(JsValue::from_str("Unsupported format")),
        };

        Ok(Self {
            image: image.decode().map_err(|e| e.to_string())?,
            format,
        })
    }

    #[wasm_bindgen]
    pub fn thumbnail(&self, width: u32, height: u32) -> Result<Vec<u8>, JsValue> {
        let thumbnail = self.image.thumbnail(width, height);

        let mut w = Cursor::new(Vec::new());
        thumbnail
            .write_to(&mut w, self.format)
            .map_err(|e| e.to_string())?;

        Ok(w.into_inner())
    }
}
