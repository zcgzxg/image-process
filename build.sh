cargo +nightly build --release

wasm-bindgen \
    target/wasm32-unknown-unknown/release/image_process.wasm \
    --out-dir ./web/src/image-process \
    --out-name index \
    --target bundler \
    --reference-types \
    --weak-refs

static-compress \
    -c brotli -q 11 \
    ./web/src/image-process/*.wasm

ls -lah ./web/src/image-process
