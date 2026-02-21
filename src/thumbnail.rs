use std::io::Cursor;

use image::{DynamicImage, ImageFormat, ImageReader, imageops};
use wasm_bindgen::prelude::*;

const SUPPORTED_FORMATS: &[ImageFormat] = &[ImageFormat::Png, ImageFormat::Jpeg, ImageFormat::WebP];

/// 图片对象
#[wasm_bindgen]
pub struct Image {
    image: DynamicImage,
    format: ImageFormat,
}

#[wasm_bindgen]
impl Image {
    /// 创建图片对象
    #[wasm_bindgen(constructor)]
    pub fn new(image_data: Vec<u8>) -> Result<Self, JsError> {
        let reader = Cursor::new(image_data);
        let image = ImageReader::new(reader).with_guessed_format()?;

        let format = match image.format() {
            Some(format) => {
                if !SUPPORTED_FORMATS.contains(&format) {
                    return Err(JsError::new(&format!(
                        "Unsupported format: {}",
                        format.to_mime_type()
                    )));
                }
                format
            }
            None => return Err(JsError::new("Unsupported format None")),
        };

        Ok(Self {
            image: image.decode().map_err(|e| {
                JsError::new(&format!(
                    "err: {}, format: {}",
                    e.to_string(),
                    format.to_mime_type()
                ))
            })?,
            format,
        })
    }

    /// 返回图片的 MIME 类型，如 "image/jpeg"、"image/png"
    #[wasm_bindgen(getter = mimeType)]
    pub fn mime_type(&self) -> String {
        self.format.to_mime_type().to_string()
    }

    /// 生成缩略图
    #[wasm_bindgen]
    pub fn thumbnail(&self, width: u32, height: u32) -> Result<Vec<u8>, JsError> {
        let thumbnail = self.image.thumbnail(width, height);

        let mut w = Cursor::new(Vec::new());
        thumbnail.write_to(&mut w, self.format)?;

        Ok(w.into_inner())
    }

    #[wasm_bindgen]
    pub fn overlaying(&mut self, top_image: &Image) -> Result<Vec<u8>, JsError> {
        let (wa, ha) = (self.image.width(), self.image.height());
        let (target_w, target_h) = (((wa as f32) * 0.1) as u32, ((ha as f32) * 0.1) as u32);
        let (x, y) = ((wa as f32) * 0.88, (ha as f32) * 0.88);

        let thumbnail = top_image.image.thumbnail(target_w, target_h);
        imageops::overlay(&mut self.image, &thumbnail, x as i64, y as i64);
        let mut w = Cursor::new(Vec::new());
        self.image.write_to(&mut w, self.format)?;

        Ok(w.into_inner())
    }
}
