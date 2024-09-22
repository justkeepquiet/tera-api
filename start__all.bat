@echo off
title TeraAPI
node --expose-gc --max_old_space_size=8192 src/app
pause