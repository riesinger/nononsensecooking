#!/usr/bin/env bash
# Refresh the vendored Fuse.js bundle to match the version referenced from
# layouts/_default/baseof.html. Run this after Renovate opens a PR bumping
# the filename — Renovate updates the reference, this script drops in the
# matching artifact.
#
# Source: the official npm tarball on registry.npmjs.org. We extract
# `dist/fuse.min.mjs` (Fuse.js no longer ships a UMD/IIFE bundle as of 7.1).
set -euo pipefail

cd "$(dirname "$0")/.."

VERSION="$(grep -oE 'vendor/fuse-[0-9.]+\.min\.mjs' layouts/_default/baseof.html \
  | head -n1 \
  | sed -E 's|.*fuse-([0-9.]+)\.min\.mjs|\1|')"

if [[ -z "$VERSION" ]]; then
  echo "Could not detect Fuse.js version in baseof.html" >&2
  exit 1
fi

TARGET="assets/vendor/fuse-${VERSION}.min.mjs"
TARBALL_URL="https://registry.npmjs.org/fuse.js/-/fuse.js-${VERSION}.tgz"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Fetching Fuse.js ${VERSION} -> ${TARGET}"
curl -fsSL "$TARBALL_URL" -o "$TMP/fuse.tgz"
tar -xzf "$TMP/fuse.tgz" -C "$TMP" package/dist/fuse.min.mjs

mkdir -p assets/vendor
cp "$TMP/package/dist/fuse.min.mjs" "$TARGET"

# Drop any stale versioned bundles so the working tree stays clean.
find assets/vendor -maxdepth 1 -type f \
  \( -name 'fuse-*.min.js' -o -name 'fuse-*.min.mjs' \) \
  ! -name "fuse-${VERSION}.min.mjs" -delete

echo "Done. Verify with: head -n 4 ${TARGET}"
