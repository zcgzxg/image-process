cargo +nightly build --release

wasm-opt -O3 \
    --enable-nontrapping-float-to-int \
    --enable-bulk-memory \
    --enable-simd \
    --strip-debug \
    --strip-producers \
    target/wasm32-unknown-unknown/release/image_process.wasm \
    -o target/wasm32-unknown-unknown/release/image_process.wasm

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
