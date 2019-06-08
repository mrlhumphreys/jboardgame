#!/bin/bash

# prepeare for release
node -p "require('./package.json').version" | xargs -I {} git tag -a v{} -m 'Version {}'

# release upstream
git push origin master
git push --tags
npm publish
