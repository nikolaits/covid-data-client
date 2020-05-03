#!/usr/bin/env sh

set -e

ng build --prod --base-href /covid-data-client/

cd dist/covid-data-client

git init
git add -A
git commit -m 'deploy'

git push -f https://github.com/nikolaits/covid-data-client.git master:gh-pages

cd -