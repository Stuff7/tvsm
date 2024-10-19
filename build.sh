#!/bin/bash

npmBin="./node_modules/.bin"
flags="--sourcemap --bundle --outdir=dist --outbase=build --minify --alias:~=./build"
if [[ "$1" = "release" ]]; then
  flags="$flags --drop-labels=DEV"
  pathChanged=""
else
  pathChanged=$(cat)
fi

sass="$npmBin/sass --style compressed src/style.scss dist/style.css"
esbuild="$npmBin/esbuild build/main.tsx $flags"

if [[ "$pathChanged" == *".scss" ]]; then
  $sass
elif [[ "$pathChanged" == *".tsx" || "$pathChanged" == *".ts" ]]; then
  $npmBin/jsx src
  $esbuild
else
  mkdir -p dist
  rm -rf dist/*

  # ~/dev/rust/jsx/target/debug/jsx src
  $npmBin/jsx src
  cp -r public/* dist & $sass & $esbuild & wait
fi
