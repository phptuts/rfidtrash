#!/usr/bin/bash
cd ~/rfidtrash/
node app.js
sleep 30s
/usr/bin/iceweasel -new-window http://localhost:3000/
