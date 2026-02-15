export RUSTFLAGS="-C target-feature=-reference-types"

cargo build \
    --target wasm32-unknown-unknown \
    --release

wasm-bindgen \
    target/wasm32-unknown-unknown/release/image_process.wasm \
    --out-dir dist-mp \
    --target web

# 使用 ast-grep 自动修改生成的代码以兼容小程序
echo "正在修改生成的代码以兼容小程序..."
sg scan -U ./dist-mp

static-compress \
    -c brotli \
    ./dist-mp/*.wasm

ls -lah ./dist-mp