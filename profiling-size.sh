RUSTFLAGS="-g" \
CARGO_PROFILE_RELEASE_DEBUG=true \
CARGO_PROFILE_RELEASE_STRIP=none \
cargo build --release --target wasm32-unknown-unknown

echo "Dominators:"

twiggy dominators \
    target/wasm32-unknown-unknown/release/mp4_mask.wasm | head -n 20

echo "Top 20:"

twiggy top \
    -n 20 \
    target/wasm32-unknown-unknown/release/mp4_mask.wasm

echo "gargabe:"

twiggy garbage \
    target/wasm32-unknown-unknown/release/mp4_mask.wasm