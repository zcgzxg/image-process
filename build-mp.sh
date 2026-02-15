export RUSTFLAGS="-C target-feature=-reference-types"

cargo build \
    --target wasm32-unknown-unknown \
    --release

wasm-bindgen \
    target/wasm32-unknown-unknown/release/image_process.wasm \
    --out-dir dist-mp \
    --target web

static-compress \
    -c brotli \
    ./dist-mp/*.wasm

ls -lah ./dist-mp