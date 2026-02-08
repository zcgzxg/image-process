wasm-pack build \
  --release \
  --weak-refs \
  --out-dir dist-web \
  --reference-types \
  --target web \
  -- --no-default-features

static-compress \
    -c brotli \
    ./dist-web/*.wasm