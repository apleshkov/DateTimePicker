#!/bin/sh

cmd="java -jar ./tools/yuicompressor-2.4.6/build/yuicompressor-2.4.6.jar"

in=$1
out=$2

eval ${cmd}" "${in}" --nomunge --disable-optimizations --charset utf-8 -o "${out}