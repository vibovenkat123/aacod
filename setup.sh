#!/bin/bash

if [ "$(ls -A $pwd)" ]; then
    echo "Directory is not empty"
    exit 1
fi

echo "Installing node"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install --lts

echo "Initializing project"

git init
npm init -y
npm i -D typescript
npm i -D @types/node
npm i @vaibhavvenkat/aacod
tsc --init --outDir dist
mkdir src
touch src/index.ts

echo "node_modules" >> .gitignore
echo "dist" >> .gitignore
