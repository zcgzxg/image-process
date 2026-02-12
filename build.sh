cargo build \
    --target wasm32-unknown-unknown \
    --release

wasm-bindgen \
    target/wasm32-unknown-unknown/release/image_process.wasm \
    --out-dir web/src/image-process \
    --target bundler \
    --reference-types \
    --weak-refs

static-compress \
    -c brotli \
    ./web/src/image-process/*.wasm

ls -lah ./web/src/image-process