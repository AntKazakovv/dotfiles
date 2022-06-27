#!/bin/bash

engine_ver=$(jq .version < ./package.json | sed 's/"//g');
current_dir=$(pwd);
temp_dir="temp/repo";

declare -A projects
declare -A branches

projects[0]="git@wlcgitlab.egamings.com:wlcdevcasino/web.git";
branches[0]="develop test master scr1-profile scr2-var1 scr2-var2 scr1-var1 scr1-var2 scr1-aff scr1-kiosk scr2-kiosk";

projects[1]="git@wlcgitlab.egamings.com:sportsbook/enginesportsbooks.git";
branches[1]="develop test";

projects[2]="git@wlcgitlab.egamings.com:tkcatcasino/web.git";
branches[2]="+scr0-pretest";

projects[3]="git@wlcgitlab.egamings.com:wlcdevcasinokiosk/web.git";
branches[3]="develop master scr1-var1 scr1-var2";

clean_temp() {
    cd $current_dir
    rm -rf "./$temp_dir"
}

#clear npm cache
if [[ $1 != "no-docker" ]]; then
    cd ~/Projects/wlc-docker/
    ./node14.sh wlc-engine npm cache clear -f
    cd -
else
    npm cache clear -f
fi

for key in ${!projects[*]}; do

    # clone repo
    git clone ${projects[$key]} "./$temp_dir"
    cd "./$temp_dir"
    git fetch
    git checkout develop

    #get current engine version
    current_ver=$(jq '.dependencies["@egamings/wlc-engine"]' < package.json | sed 's/"//g')

    #make devcasino branch if previous engine release was stable
    if [ $(echo $current_ver | awk '/^[0-9]+\.[0-9]+\.[0-9]+$/') ]  && [ $(echo ${projects[$key]} | awk '/wlcdevcasino/') ]; then
        stable_branch="scr"$(echo $current_ver | sed 's/\./-/g')
        for branch in ${branches[$key]}; do
            if [[ $branch == "master" ]]; then
                continue;
            elif [[ $branch == "test" ]]; then
                continue;
            elif [[ $branch == "develop" ]]; then
                git checkout develop
                git branch -D $stable_branch
                git checkout -b $stable_branch
                git push origin $stable_branch -f
            else
                target=$(echo $branch | sed 's/\+//g')
                if [[ $target == $branch ]]; then
                    git branch -D $branch
                    git checkout $branch
                    git branch -D $branch-s
                    git checkout -b $branch-s
                    git push origin $branch-s --force-with-lease
                fi
            fi
        done;
        git checkout develop
    fi

    #lock engine version
    sed -i -e "s|\"@egamings\/wlc-engine\": \"$current_ver\"|\"@egamings\/wlc-engine\": \"$engine_ver\"|g" ./package.json

    # update npm dependencies
    rm -rf node_modules package-lock.json
    if [[ $1 != "no-docker" ]]; then
        cd ~/Projects/wlc-docker/
        ./node14.sh wlc-engine/$temp_dir npm i
        cd -
    else
        npm i
    fi

    # update composer dependencies
    rm -rf vendor composer.lock
    cd ~/Projects/wlc-docker/
    ./compose_php.sh wlc-engine/$temp_dir composer install
    cd -

    # check updated wlc-engine version
    lock_ver=$(jq '.dependencies["@egamings/wlc-engine"].version' < package-lock.json | sed 's/"//g');
    if [[ $lock_ver != $engine_ver ]]; then
        clean_temp
        echo -e "\e[5m\e[1m\e[91mEngine version don't match, something went wrong ($lock_ver vs $engine_ver)\e[25m\e[0m"
        exit 1;
    fi

    # update project configs
    npx gulp update:configs

    git status

    read -p "See diff for ${projects[$key]} and confirm process [y/N]" yn

    if [[ $yn == 'y' ]]; then
        git add .
        git commit -m "SCR #0 - project up $engine_ver"

        # update neccesery branches
        for branch in ${branches[$key]}; do
            if [[ $branch == "master" ]]; then
                # make prod release
                echo "make prod release";
                git checkout master
                git merge develop -m "SCR #0 - project up $engine_ver"
                git push origin master
                echo y | ./make-prod-release
            elif [[ $branch == "develop" ]]; then
                #update develop
                echo "make update develop";
                git checkout develop
                git push origin develop
            elif [[ $branch == "test" ]]; then
                #make test release
                echo "make test release";
                git checkout develop
                git push origin develop
                echo y |  ./make-test-release
            else
                target=$(echo $branch | sed 's/\+//g')
                if [[ $target == $branch ]]; then
                    echo "make update $branch";
                    git checkout $branch
                    git rebase origin/develop
                    git push origin $branch --force-with-lease
                else
                    echo "make create $target";
                    git branch -D $target
                    git checkout -b $target
                    git push origin $target -f
                fi
            fi
        done;
    fi

    # clean temp direcotory
    clean_temp;
done;
