@echo off
title TeraAPI - Admin Panel
node --expose-gc --max_old_space_size=8192 src/app --component admin_panel
pause