#!/bin/bash

mkdir -p dist
rm -rf dist/*

flags="--sourcemap --bundle --outdir=dist --outbase=src --minify"
[ "$1" = "release" ] && flags="$flags --drop-labels=DEV"

___NPM="./node_modules/.bin"

cp -r public/* dist & $___NPM/sass --style compressed src/style.scss dist/style.css & $___NPM/esbuild src/main.tsx $flags & wait
./node_modules/.bin/jsx dist
