#!/bin/bash -e

project=$(jq .name < ./package.json)
branch=$(git rev-parse --abbrev-ref HEAD | awk '/master|hotfix/')
remote=$(git remote | head -n 1)

declare prevver

die() {
    echo "$@"
    git checkout "$branch"
    exit 1
}

help() {
    echo "library release publisher"
    echo
    echo -e "usage to publish:"
    echo -e "\t$0 major   - increase major version (1.x.y, only from master branch)"
    echo -e "\t$0 minor   - increase minor version (x.y.0, only from master branch)"
    echo -e "\t$0 release - increased patch version (x.y.z from master branch, x.y.z.n from hotfix branch)"
    echo -e "\t$0 rc      - create release candidate version x.y.z-rc.n"
    echo -e "\t$0 x.y.z   - set version to x.y.z (only from master branch)"
    echo -e "\t$0         - show this help message"

    exit 0
}

release() {

    tag="$@"

    sed -i -e "s/\"version\": \"${prevver}\"/\"version\": \"$@\"/g" ./package.json

    if ! git add src/docs/content; then
        die "ERROR: git add src/docs/content failed"
    fi

    if ! git add package.json; then
        die "ERROR: git add package.json failed"
    fi

    if ! git commit -m "Updated for release ${project} $@"; then
        die "ERROR: git commit failed"
    fi

    if ! git tag -a -m "Release ${project} $@" $tag; then
        die "ERROR: git tag failed"
    fi

    if ! git push $remote HEAD:$branch $tag; then
        die "ERROR: git push failed"
    fi

    if ! git checkout $branch; then
        die "ERROR: post-release git checkout failed (should never happen)"
    fi
    if ! git pull; then
        die "ERROR: post-release git pull failed (should never happen)"
    fi
}

if [ -z "$branch" ]; then
    die "This script must be run from master or hotfix branch (by a release engineer)."
fi

echo "Making sure up-to-date $branch branch is used"
if git fetch $remote && git checkout remotes/$remote/$branch; then
    :
else
    echo "Failed to get the latest $branch"
    exit -1
fi

prevver=$(jq -r .version < ./package.json)

case "x$1" in
xmajor)
    if [ "$branch" != "master" ]; then
        die "ERROR: Cannot release new major version from '$branch'"
    fi
    nextver=$(./vermath "$prevver" --major)
    ;;
xminor)
    if [ "$branch" != "master" ]; then
        die "ERROR: Cannot release new minor version from '$branch'"
    fi
    nextver=$(./vermath "$prevver" --minor)
    ;;
xrelease)
    if [ "$branch" == "master" ]; then
        nextver=$(./vermath "$prevver" --normal)
    else
        nextver=$(./vermath "$prevver" --hotfix)
    fi

    ;;
xrc)
    if [ "$branch" != "master" ]; then
        die "ERROR: Cannot create release candidate from '$branch'"
    fi
    nextver=$(./vermath "$prevver" --preid)
    ;;
x)
    help
    ;;
*)
    if [ "$branch" != "master" ]; then
        die "ERROR: Cannot release version '$1' from '$branch'"
    fi
    nextver="$1"
    ;;
esac

tag="$nextver"

echo
echo "Source: remotes/$git_remote/$branch"
echo "Tag: $nextver"
echo

read -p "Create new release tag (y/N): " y
if [ "x$y" == "xy" ]; then

    if [ "$branch" == "master" ]; then
        if ! npm run gulp change-logs -- --tag=$nextver; then
            die "ERROR: changelog generation failed"
        fi
    fi

    release "$nextver"
fi

