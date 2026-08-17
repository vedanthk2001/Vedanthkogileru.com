#!/usr/bin/env bash
# Build the static export and publish it to the gh-pages branch.
set -euo pipefail
cd "$(dirname "$0")"
rm -rf out .next
npm run build
cd out
git init -q
git checkout -q -b gh-pages
git add -A
git commit -q -m "Deploy static site to GitHub Pages"
git remote add origin git@github.com:vedanthk2001/Vedanthkogileru.com.git
git push -qf origin gh-pages
echo "Deployed to gh-pages."
