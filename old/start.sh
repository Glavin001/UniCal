#!/bin/bash

sp="" # Screen Prefix
w=""

run () {
    echo " ===== "
    echo "Creating ${name}"
    screen -dmS "${sp}${name}" bash
    echo "Starting ${name}"
    screen -S "${sp}${name}" -X stuff "${w}${cmd};\n"
    echo "Should be all up and running!"
    echo " ===== "
}

# UniAPI Mongod
name="uniapi-mongod"
cmd="mongod --dbpath ~/data/db"
run

# UniAPI Server
name="uniapi-server"
cmd="cd ~/UniCal/; node uniapi-server/"
run

# UniCal Server
name="unical-server"
cmd="cd ~/UniCal/; node unical-server/"
run


