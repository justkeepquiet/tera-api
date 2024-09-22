@echo off
title TeraAPI - Gateway API
node --expose-gc --max_old_space_size=8192 src/app --component gateway_api
pause