rm -rf ./dist-mp/*

# export RUSTFLAGS="-C target-feature=+simd128,-reference-types"
cargo +nightly build --release

wasm-bindgen \
    target/wasm32-unknown-unknown/release/image_process.wasm \
    --out-dir dist-mp \
    --out-name lib \
    --target web \
    --reference-types \
    --weak-refs

# 使用 ast-grep 自动修改生成的代码以兼容小程序
echo "正在修改生成的代码以兼容小程序..."
sg scan -U ./dist-mp

# 在dist-mp/lib.js最上面添加代码
# /* eslint-disable */
# import { TextDecoder, TextEncoder } from '@/utils/encoding'

sed -i '1i /* eslint-disable */\nimport { TextDecoder, TextEncoder } from "@/utils/encoding";\n' ./dist-mp/lib.js

static-compress \
    -c brotli -q 11 \
    ./dist-mp/*.wasm

ls -lah ./dist-mp
