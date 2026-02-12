cargo build \
    --target wasm32-unknown-unknown \
    --release

wasm-bindgen \
    target/wasm32-unknown-unknown/release/image_process.wasm \
    --out-dir dist-web \
    --target bundler \
    --reference-types \
    --weak-refs

static-compress \
    -c brotli \
    ./dist-web/*.wasm

ls -lah ./dist-web