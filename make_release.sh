#!/bin/bash

PROJECT_NAME=$(jq .name < ./package.json)
stable_branch=$(git branch | awk '/^\* master/ { print $2 }')

if ! [ -n "$stable_branch" ]; then
    echo "Stable branch must be '$stable_branch'"
    exit -1
fi

echo "Making sure up-to-date $stable_branch branch is used"
git_remote=$(git remote | head -n 1)
if git fetch $git_remote && git checkout remotes/$git_remote/$stable_branch; then
    :
else
    echo "Failed to get the latest $stable_branch"
    exit -1
fi

prevver=$(jq .version < ./package.json | sed -e 's/"//g')

if [ ! -z "$1" ];then

    if [[ $1 == 'major' ]]; then
        read -p "Sure you want to change the major version? (yes/no): " CONT

        if test "$CONT" != "yes"; then
            exit -1
        fi
        nextver="$(( $(echo $prevver | cut -f1 -d.) + 1 )).0.0"
    fi

    if [[ $1 == 'minor' ]]; then
        read -p "Sure you want to change the minor version? (yes/no): " CONT

        if test "$CONT" != "yes"; then
            exit -1
        fi
        nextver="$(echo $prevver | cut -f1 -d.).$(( $(echo $prevver | cut -f2 -d.) + 1 )).0"
    fi
else
    nextver="$(echo $prevver | cut -f1 -d.).$(echo $prevver | cut -f2 -d.).$(( $(echo $prevver | cut -f3 -d.) + 1 ))"
fi

ver=${2:-$nextver}
tag="$ver"

echo
echo "Source: remotes/$git_remote/$stable_branch"
echo "Tag: $tag"
echo

read -p "Create new release tag (yes/no): " CONT

if test "$CONT" != "yes"; then
    exit -1
fi

sed -i -e "s/\"version\": \"${prevver}\"/\"version\": \"${ver}\"/g" ./package.json

git add package.json

git commit -m "Updated for release ${PROJECT_NAME} $ver" && \
    git tag -a -m "Release ${PROJECT_NAME} $ver" $tag && \
    git push $git_remote HEAD:$stable_branch $tag && \
    echo "OK" || echo "FAILED"

git checkout $stable_branch
git pull
