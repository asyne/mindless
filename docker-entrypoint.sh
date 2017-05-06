#!/bin/bash

google-chrome \
  --headless \
  --disable-gpu \
  --hide-scrollbars \
  --remote-debugging-port=9222 'about:blank' &

sleep 3s

node src/index.js $@
