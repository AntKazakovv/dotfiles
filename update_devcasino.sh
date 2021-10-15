#!/bin/bash

branches="scr1-profile scr2-var1 scr2-var2 scr2-var3 scr1-var1";
git_url="git@wlcgitlab.egamings.com:wlcdevcasino/web.git";

engine_ver=$(jq .version < ./package.json | sed -e 's/"//g');
current_dir=$(pwd);

clean_temp() {
    cd $current_dir
    rm -rf ./temp/devcasino
}

# clone dev_casino
git clone $git_url ./temp/devcasino
cd ./temp/devcasino
git checkout develop

# update npm dependencies
rm -rf node_modules package-lock.json
if [[ $1 != 'no-docker' ]]; then
    cd ~/Projects/wlc-docker/
    ./node14.sh wlc-engine/temp/devcasino npm cache clear -f
    ./node14.sh wlc-engine/temp/devcasino npm i
    cd -
else
    npm cache clear -f
    npm i
fi

# check updated wlc-engine version
lock_ver=$(jq '.dependencies["@egamings/wlc-engine"].version' < package-lock.json | sed -e 's/"//g');
if [[ $lock_ver == $engine_ver ]]; then
    clean_temp
    echo -e "\e[5m\e[1m\e[91mEngine version don't match, something went wrong\e[25m\e[0m"
    exit 1;
fi

# update composer dependencies
rm -rf vendor composer.lock
cd ~/Projects/wlc-docker/
./compose_php.sh wlc-engine/temp/devcasino composer install
cd -

# update project configs
npx gulp update:configs

# commit all changes & make test release
git add .
git commit -m "SCR #0 - project up $engine_ver"
git push origin develop
echo y |  ./make-test-release

# make prod release
git checkout master
git merge develop -m "SCR #0 - project up $engine_ver"
git push origin master
echo y | ./make-prod-release

# update neccesery branches
for branch in $branches; do
    git checkout $branch
    git rebase develop
    git push origin $branch --force-with-lease
done;

# clean temp direcotory
clean_temp
