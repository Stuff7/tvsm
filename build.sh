#!/bin/bash

npmBin="./node_modules/.bin"
flags="--sourcemap --bundle --outdir=dist --outbase=src --minify"
if [[ "$1" = "release" ]]; then
  flags="$flags --drop-labels=DEV"
  pathChanged=""
else
  pathChanged=$(cat)
fi

sass="$npmBin/sass --style compressed src/style.scss dist/style.css"
esbuild="$npmBin/esbuild src/main.tsx $flags"

if [[ "$pathChanged" == *".scss" ]]; then
  $sass
elif [[ "$pathChanged" == *".tsx" || "$pathChanged" == *".ts" ]]; then
  $esbuild
  $npmBin/jsx dist
else
  mkdir -p dist
  rm -rf dist/*

  cp -r public/* dist & $sass & $esbuild & wait
  $npmBin/jsx dist
fi
