#!/bin/bash -e

engine_ver=$(jq .version < ./package.json | sed -e 's/"//g');

tagprefix="$(echo $engine_ver | cut -f1 -d.).$(echo $engine_ver | cut -f2 -d.)."

branchname(){
    echo hotfix-$(date +%Y%m%d)-$1
}

re="[a-z0-9A-Z_\\.\\-]+"

usage() {
    echo "This script creates a new hotfix branch (to be used by a release engineer)"
    echo "Branch name will be $(branchname TAIL)"
    echo "TAIL is small descriptive name for this branch; for example, if you run"
    echo
    echo "  ./make-hotfix-branch 1.3.255 Bug1"
    echo
    echo "it will create branch $(branchname Bug1) based on the specified version"
    echo
    echo "TAIL must match the regular expression ^$re\$ (alphanumerics, underscore, dash, dot)"
    echo "VERSION is a version to base hotfix tag on; could be specified as 1.3.255 or just 255 (will be prefixed with $tagprefix)"
    echo
    echo "Usage: $0 version TAIL"
    echo "($0 -l for showing existing release tags)"
    exit 1
}

mkbranch() {
    branch=$1
    tag=$2
    if !  git checkout -b $branch $tag; then
        rc=$?
        echo "ERROR: cannot checkout $tag to $branch; rc=$rc"
        exit 1
    fi
    if ! git push -u origin $branch; then
        rc=$?
        echo "ERROR: failed to push/set tracking $branch to origin; rc=$?"
        exit 1
    fi
}

# -l for showing release tags (should be no hotfixes here)

if [ "x$1" == "x-l" ]; then
    git tag -l | sort -V | grep -P '^\d+\.\d+\.\d+$'
    exit 0
fi

if [ "x$1" == "x" -o "x$2" == "x" ]; then
    usage
    exit $?
fi

if ! git fetch -t;
then
    rc=$?
    echo " * git fetch failed"
    exit $rc
fi

suffix=$2

if [[ "$suffix" =~ ^[a-zA-Z0-9\_\.\-]+$ ]]; then
    :
else
    echo "$suffix do not match $re"
    exit 1
fi

version=$1
tag="$version"

if [[ "$tag" =~ ^[1-9][0-9]*$ ]]; then
    tag="$tagprefix$tag"
fi
if [[ "$tag" =~ ^[1-9][0-9]*\.[0-9][0-9]*$ ]]; then
    tag="$tagprefix$tag"
fi

if ! git rev-parse "$tag" >/dev/null 2>&1; then
    echo "ERROR: Tag $tag is not present in repo; choose existing release tag instead ($0 -l for list)"
    exit 1
fi

branch=$(branchname $suffix)

if [ -n "$3" ];
then
    y=$3
else
    echo -n "Create new hotfix branch $branch based on $tag [y/N]? "; read y
fi

[ "x$y" == "xy" ] && mkbranch $branch $tag

exit $?
