# HOW TO RUN: ./launch.sh

# ⚠️ [CTRL]+[C] WILL NOT BUILD THE PROJECT ⚠️
# USE [Q]+[ENTER] TO STOP HOSTING AND BUILD

# SHOULD BE A .SH FILE, HOWEVER IT WONT WORK ON WINDOWS SO I HAD TO USE A .BAT

YL='\033[1;33m'
GR='\033[0;30m'
NC='\033[0m'

echo -e "
${YL}[LAUNCHER]${NC} ${GR}(info) >>${NC} Launching from: Simulazione/launch.sh"
echo -e "${YL}[LAUNCHER]${NC} ${GR}(warning) >>${NC} Use [Q]+[ENTER] to quit safely and allow vite to build the project!"
echo -e "${YL}[LAUNCHER]${NC} ${GR}(info) >>${NC} Press [ENTER] to continue"

# Await confirmation to continue
read run

echo -e "${YL}[LAUNCHER]${NC} ${GR}(event) >>${NC} Running Vite..."

# Move to the source directory
cd src

# Start vite hosting
npx vite

echo -e "
${YL}[LAUNCHER]${NC} ${GR}(event) >>${NC} Building Project...
"

# Build the project for production upon stopping host
npx vite build

# Move the built project to the parent directory
mv dist ../

echo -e "
${YL}[LAUNCHER]${NC} ${GR}(info) >>${NC} Run './launch.sh' to launch the project again"
echo -e "${YL}[LAUNCHER]${NC} ${GR}(event) >>${NC} Exiting...
"