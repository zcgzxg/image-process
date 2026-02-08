wasm-pack build \
  --release \
  --weak-refs \
  --out-dir dist-mp \
  --reference-types \
  --target no-modules \
  -- --no-default-features

static-compress \
    -c brotli \
    ./dist-mp/*.wasm