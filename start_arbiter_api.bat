@echo off
title TeraAPI - Arbiter API
node --expose-gc --max_old_space_size=8192 src/app --component arbiter_api
pause