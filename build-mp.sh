cargo build \
    --target wasm32-unknown-unknown \
    --release

wasm-bindgen \
    target/wasm32-unknown-unknown/release/image_process.wasm \
    --out-dir dist-mp \
    --target bundler \
    --encode-into never \
    --reference-types \
    --weak-refs

static-compress \
    -c brotli \
    ./dist-mp/*.wasm

ls -lah ./dist-mp