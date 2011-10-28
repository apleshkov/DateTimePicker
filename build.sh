#!/bin/sh

echo "[Compass]"
tools/ruby-gems/bin/compass compile --trace --boring --time --no-line-comments --config ./resources/sass/config.rb
echo
echo "[JSBuilder2]"
java -jar tools/JSBuilder2/JSBuilder2.jar --projectFile ./date-time-ux.jsb2 --homeDir .