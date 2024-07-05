#!/usr/bin/env python3

import os
import re
import json
import subprocess
import datetime
import time
from colorama import init, Fore

temp_folder = "temp/repo/"
lang_repo = "git@wlcgitlab.egamings.com:wlc/wlc-engine-translate.git"

projects = [
    {
        # Devcasino
        "id": "1",
        "repository": "git@wlcgitlab.egamings.com:wlcdevcasino/web.git",
        "branches": ["develop", "master", "scr1-profile", "scr1-var1", "scr1-var2", "scr1-mc1", "scr1-lic1", "scr1-kiosk", "scr1-aff", "scr2-var1", "scr2-var2", "scr2-mc1", "scr2-lic1", "scr2-kiosk", "scr3-wolf1"],
    },
    {
        # Kiosk
        "id": "2",
        "repository": "git@wlcgitlab.egamings.com:wlcdevcasinokiosk/web.git",
        "branches": ["develop", "scr1-var1", "scr1-var2"],
    },
    {
        # Sportsbook
        "id": "3",
        "repository": "git@wlcgitlab.egamings.com:sportsbook/enginesportsbooks.git",
        "branches": ["develop"],
    },
]


# Вычисление версии движка
def change_version(action, v):

    match action:

        case "release":
            if not (len(v) > 3 and v[3] == "rc"):
                v[1] = v[1] + 1
                v[2] = 0
            return v[0:3]

        case "rc":
            rc = 1
            if len(v) > 4 and v[3] == "rc":
                rc = v[4] + 1
            else:
                v[1] = v[1] + 1
                v[2] = 0
            v = v[0:3]
            v[2] = str(v[2]) + "-rc"
            v.append(rc)
            return v

        case "major":
            v[0] = v[0] + 1
            for i in range(1, len(v)):
                v[i] = 0
            return v[0:3]

        case "patch":
            if not (len(v) > 3 and v[3] == "rc"):
                v[2] = v[2] + 1
            return v[0:3]

        case "catcasino":
            print(
                Fore.YELLOW
                + f"Current cats engine based on {v[1]} default engine version"
                + Fore.RESET
            )
            v[1] = input(
                Fore.YELLOW
                + "What new tag will cats be based on (example 54): "
                + Fore.RESET
            )
            v[2] = 0
            return v

        case "hotfix":
            hotfix = 1
            if len(v) > 4 and v[3] == "hotfix":
                hotfix = v[4] + 1
            v = v[0:3]
            v[2] = str(v[2]) + "-hotfix"
            v.append(hotfix)
            return v

        case "deltag":
            if len(v) > 4 and v[3] == "rc":
                rc = v[4] - 1
                v = v[0:3]
                v[2] = str(v[2]) + "-rc"
                v.append(rc)
                return v

            elif len(v) > 4 and v[3] == "hotfix":
                hotfix = v[4] - 1
                v = v[0:3]
                v[2] = str(v[2]) + "-hotfix"
                v.append(hotfix)
                return v

            else:
                v[1] = v[1] - 1
                v[2] = 0
                return v[0:3]

        case _:
            error_message()


def parse_version(version):
    v = []
    for k in version.split("."):
        if k.find("-rc") != -1:
            v.append(int(k.replace("-rc", "")))
            v.append("rc")
        elif k.find("-hotfix") != -1:
            v.append(int(k.replace("-hotfix", "")))
            v.append("hotfix")
        else:
            v.append(int(k))
    while len(v) < 3:
        v.append(0)
    return v


# Получение текущей даты
def get_date():
    return datetime.date.today().strftime("%Y%m%d")


# Сообщение о ложном выборе
def error_message():
    print(Fore.RED + """\n I don't know this kind of magic. Enter the word in brackets. Let's try again...""" + Fore.RESET)


# Получение содержимого package.json
def get_json(project_folder=None):
    if project_folder:
        file_path = os.path.join(project_folder, "package.json")
    else:
        file_path = "package.json"

    with open(file_path, "r") as j:
        json_data = json.load(j)

    return json_data


# Получение версии движка / переводов / проектов в package.json
def get_version(project=None):
    json_data = get_json() if project is None else get_json(temp_folder)
    version = json_data.get("version")

    if project == "translate":
        return version

    elif project == "project":
        version = json_data["dependencies"].get("@egamings/wlc-engine")
        return version

    else:
        # translate = json_data["dependencies"].get("@egamings/wlc-engine-translate")
        return version



# Обновление версии / движка / переводов / проектов в package.json
def set_version(project, version):
    print(Fore.YELLOW + "Updating version into the package.json ..." + Fore.RESET)

    match project:

        case "engine":
            json_data = get_json()
            print(Fore.YELLOW + f"Current engine version: {json_data["version"]}" + Fore.RESET)

            json_data.update({"version": version})
            with open("package.json", "w") as j:
                json.dump(json_data, j, indent=4)
            print(Fore.YELLOW + f"New engine version: {json_data["version"]}" + Fore.RESET)

        case "langpack":
            json_data = get_json()
            print(Fore.YELLOW + f"Current language version: {json_data["dependencies"].get("@egamings/wlc-engine-translate")}" + Fore.RESET)

            json_data["dependencies"].update({"@egamings/wlc-engine-translate": version})
            with open("package.json", "w") as j:
                json.dump(json_data, j, indent=4)
            print(Fore.YELLOW + f"New language version: {json_data["dependencies"].get("@egamings/wlc-engine-translate")}" + Fore.RESET)

        case "translate":
            json_data = get_json(temp_folder)
            print(Fore.YELLOW + "Current translate version:", json_data["version"] + Fore.RESET)

            json_data.update({"version": version})
            with open(f"{temp_folder}package.json", "w") as j:
                json.dump(json_data, j, indent=4)
            print(Fore.GREEN + "New translate version:", json_data["version"] + Fore.RESET)

        case "project":
            json_data = get_json(temp_folder)
            print(Fore.YELLOW + "Current lock engine version:", json_data["dependencies"].get("@egamings/wlc-engine") + Fore.RESET)

            json_data["dependencies"].update({"@egamings/wlc-engine": version})
            with open(f"{temp_folder}package.json", "w") as j:
                json.dump(json_data, j, indent=4)
            print(Fore.GREEN + "New lock engine version:", json_data["dependencies"].get("@egamings/wlc-engine") + Fore.RESET)

        case _:
            error_message()



# Проверка на соответствие шаблону
def check_format(version):
    patterns = {
        "rc": r"^\d+\.\d+\.\d+-rc\.\d+$",
        "hotfix": r"^\d+\.\d+\.\d+-hotfix\.\d+$",
        "release": r"^\d+\.\d+\.\d+$"
    }

    for format, pattern in patterns.items():
        if re.search(pattern, version):
            return format

    return Fore.RED + "Version format error" + Fore.RESET


# Получение списка удаленных референсов
def get_remote_ref_list(repo_path=None):
    command = ["git", "ls-remote", "--exit-code", "--refs", "--sort=-version:refname", "--tags", "origin", "refs/tags/1.*"]
    if repo_path:
        command.insert(-2, repo_path)
    return subprocess.check_output(command, text=True).splitlines()


# Получение локального тега движка
def get_local_tag():
    local_tags = subprocess.check_output(["git", "tag", "-l", "1.*", "--sort=-version:refname", "--format=%(refname)"], text=True).splitlines()
    return local_tags[0].split("/")[-1] if local_tags else None

# Получение последнего remote тега
def get_latest_remote_tag(repo_path=None):
    remote_ref_list = get_remote_ref_list(repo_path)
    tags = [line.split("/")[-1] for line in remote_ref_list if check_format(line.split("/")[-1])]
    return tags[0] if tags else None


# Проверка на наличие тега. Возвращает имя тега, которое не занято.
def tag_duplicate_checking(action, tag_to_find, repo_path=None):
    remote_ref_list = get_remote_ref_list(repo_path)
    remote_tag_list = [ref.split("/")[-1] for ref in remote_ref_list]

    while tag_to_find in remote_tag_list:
        free_tag_name = ".".join(map(str, change_version(action, parse_version(tag_to_find))))

    return free_tag_name


# Создание нового тега
def make_tag(action, branch=None):
    print(Fore.YELLOW + "Making new tag..." + Fore.RESET)
    if branch == None:
        new_tag = ".".join([str(k) for k in change_version(action, parse_version(get_version()))])

        if action == "hotfix":
            new_tag = tag_duplicate_checking(action, new_tag)

    else:
        if branch == "develop":
            base_tag = "test-" + get_date()
        elif branch == "master":
            base_tag = "prod-" + get_date()

        try:
            tag = (
                list(
                    filter(None, subprocess.check_output(["git", "ls-remote", "--exit-code", "--refs", "--sort=-version:refname", "--tags", "origin", f"{base_tag}.*"], cwd=temp_folder, text=True).split("\n")))[-1].split("/")[-1].split(".")
            )
            tag[1] = str(int(tag[1]) + 1)
            new_tag = ".".join(tag)
        except subprocess.CalledProcessError:
            tag = None
            new_tag = base_tag + ".1"

    print(Fore.GREEN + f"Done! New tag is {new_tag}" + Fore.RESET)
    return new_tag



# Удаление локального тега движка
def del_local_tag():
    engine_version = get_version()
    local_tag = get_local_tag()

    if local_tag == engine_version:
        agree = input(Fore.YELLOW + f"Do you want to delete local tag {local_tag}? (y/n):" + Fore.RESET)

        if agree.lower() == "y":
            subprocess.run(["git", "tag", "-d", local_tag])
            print(Fore.GREEN + f"Local tag {local_tag} deleted!" + Fore.RESET)

        elif agree.lower() == "n":
            print(Fore.GREEN + "As you wish Master!" + Fore.RESET)

        else:
            error_message()
            start()

    else:
        agree = input(Fore.YELLOW + f"Engine version {engine_version} and local tag {local_tag} are different. Do you really want to delete local tag {local_tag}? (y/n):" + Fore.RESET)

        if agree.lower() == "y":
            print(Fore.GREEN + "As you wish Master!" + Fore.RESET)
            subprocess.run(["git", "tag", "-d", local_tag])
            print(Fore.GREEN + f"Local tag {local_tag} deleted!" + Fore.RESET)
        elif agree.lower() == "n":
            print(Fore.GREEN + f"Tag {local_tag} still here." + Fore.RESET)
        else:
            error_message()
            start()


# Удаление удаленного тега движка
def del_remote_tag():
    engine_version = get_version()
    remote_tag = get_latest_remote_tag()

    if remote_tag == engine_version:
        agree = input(Fore.YELLOW + f"Do you want to delete remote tag {remote_tag}? (y/n):" + Fore.RESET)

        if agree.lower() == "y":
            subprocess.run(["git", "push", "--delete", "origin", remote_tag])
            print(Fore.GREEN + f"Remote tag {remote_tag} deleted!" + Fore.RESET)
        elif agree.lower() == "n":
            print(Fore.GREEN + "As you wish Master!" + Fore.RESET)
        else:
            error_message()
            start()

    else:
        agree = input(Fore.YELLOW + f"Engine version {engine_version} and remote tag {remote_tag} are different. Do you really want to delete remote tag {remote_tag}? (y/n):" + Fore.RESET)

        if agree.lower() == "y":
            print(Fore.GREEN + "As you wish Master!" + Fore.RESET)
            subprocess.run(["git", "push", "--delete", "origin", remote_tag])
            print(Fore.GREEN + f"Remote tag {remote_tag} deleted!" + Fore.RESET)
        elif agree.lower() == "n":
            print(Fore.GREEN + f"Tag {remote_tag} still on remote repository." + Fore.RESET)
        else:
            error_message()
            start()


# Клонирование проекта
def clone_project(repo_path):
    print(Fore.YELLOW + f"Clone project {repo_path}" + Fore.RESET)
    subprocess.run(["git", "clone", repo_path, temp_folder])
    subprocess.run(["git", "fetch"], cwd=temp_folder)
    print(Fore.GREEN + "Done" + Fore.RESET)


# Пуш ветки проекта
def push_branch(branch, tag=None, project=None):
    print(Fore.YELLOW + "Pushing changes to the remote branch" + Fore.RESET)
    subprocess.run(["git", "add", "."], cwd=temp_folder)

    if project == "translate":
        subprocess.run(["git", "commit", "-m", f"Release @egamings/wlc-engine-translate {tag} version"], cwd=temp_folder)
        subprocess.run(["git", "tag", "-a", tag, "-m", f"Release @egamings/wlc-engine-translate {tag} version"], cwd=temp_folder)

    else:
        engine_version = get_version()
        subprocess.run(["git", "commit", "-m", f"SCR #0 - project up {engine_version}"], cwd=temp_folder)

        if tag:
            subprocess.run(["git", "tag", "-a", tag, "-m", f"SCR #0 - project up {engine_version}"], cwd=temp_folder)

    if tag:
        subprocess.run(["git", "push", "origin", branch, "--force-with-lease", "--follow-tags"], cwd=temp_folder)
    else:
        subprocess.run(["git", "push", "origin", branch, "--force-with-lease"], cwd=temp_folder)

    print(Fore.GREEN + "Done" + Fore.RESET)


# Очистка временной директории
def clean_temp():
    print(Fore.YELLOW + "Clean temp folder" + Fore.RESET)
    subprocess.run(["rm", "-rf", temp_folder])
    print(Fore.GREEN + "Done" + Fore.RESET)


# Очистка кэша npm
def clear_npm_cache():
    print(Fore.YELLOW + "Clean npm cache" + Fore.RESET)
    subprocess.call(["./node20.sh", "wlc-engine", "npm", "cache", "clear", "-f"], cwd=os.path.expanduser("~/Projects/wlc"))
    print(Fore.GREEN + "Done" + Fore.RESET)


# Обновление npm зависимостей
def update_npm(project_folder=None):
    folder = "" if project_folder is None else project_folder

    print(Fore.YELLOW + "Delete npm dependencies" + Fore.RESET)
    subprocess.run(["rm", "-rf", f"{folder}package-lock.json", f"{temp_folder}node_modules/"])
    print(Fore.GREEN + "Done" + Fore.RESET)

    print(Fore.YELLOW + "Update npm dependencies" + Fore.RESET)
    subprocess.call(["./node20.sh", f"wlc-engine/{folder}", "npm", "i"], cwd=os.path.expanduser("~/Projects/wlc"))
    print(Fore.GREEN + "Done" + Fore.RESET)


# Чекаут npm зависимостей
def get_depends(branch):
    print(Fore.YELLOW + "Getting dependencies from branch 'develop'" + Fore.RESET)
    subprocess.run([ "git", "checkout", f"remotes/origin/{branch}", "package.json", "package-lock.json", "composer.json", "composer.lock"], cwd=temp_folder)
    print(Fore.GREEN + "Done" + Fore.RESET)


# Обновление composer зависимостей
def update_composer():
    print(Fore.YELLOW + "Delete composer dependencies" + Fore.RESET)
    subprocess.run(["rm", "-rf", f"{temp_folder}composer.lock", f"{temp_folder}vendor/"])
    print(Fore.GREEN + "Done" + Fore.RESET)

    print(Fore.YELLOW + "Update composer dependencies" + Fore.RESET)
    subprocess.call(["./compose_php.sh", f"wlc-engine/{temp_folder}", "composer", "i"], cwd=os.path.expanduser("~/Projects/wlc"))
    print(Fore.GREEN + "Done" + Fore.RESET)


# Клонирование файлов зависимостей на текущую ветку
def small_update_branch(branch):
    print(Fore.YELLOW + "Switch the branch" + Fore.RESET)
    subprocess.run(["git", "switch", branch], cwd=temp_folder)
    print(Fore.GREEN + "Done" + Fore.RESET)

    get_depends("develop")
    push_branch(branch)


# Проверка ветки на соответствие с веткой для действия
def check_branch(branch, project_folder=None):
    print(Fore.YELLOW + f"Check project branch..." + Fore.RESET)
    current_branch = subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=project_folder, text=True).strip()

    if not branch == current_branch:
        change_branch = input(Fore.YELLOW + "The branch does not match the process. Switch to the right one? (y/n):")
        if change_branch.lower() == "y":
            subprocess.run(["git", "switch", branch], cwd=project_folder, check=True)
        elif change_branch.lower() == "n":
            print(Fore.YELLOW + "As you wish Master!" + Fore.RESET)
        else:
            error_message()
            start()
    else:
        print(Fore.GREEN + f"The branch '{branch}' is correct! Continue the process..." + Fore.RESET)


# Создание хотфикс ветки
def make_hotfix(action):
    date = get_date()
    ticket = input(Fore.YELLOW + "Insert hotfix ticket number please (example 430178): " + Fore.RESET)
    engine_version = input(Fore.YELLOW + "Insert engine version for hotfix (example 1.39.0): " + Fore.RESET)
    branch = "hotfix-" + date + "-" + ticket

    subprocess.run(["git", "switch", "-c", branch, engine_version])
    print(Fore.GREEN + "Hotfix branch created!" + Fore.RESET)

    changed = input(Fore.YELLOW + "When you add all the changes to the branch, enter 'y': " + Fore.RESET)

    if changed.lower() == "y":
        new_tag = make_tag(action)
        try:
            print(Fore.YELLOW + "Commiting all changes..." + Fore.RESET)
            subprocess.run(["git", "add", "."])
            subprocess.run(["git", "commit", "-m", f"SCR #{ticket} - fix: Engine hotfix from {engine_version} version"])
            print(Fore.YELLOW + "Pushing all changes" + Fore.RESET)
            output = subprocess.run(["git", "push", "origin", branch], check=True)
            print(Fore.GREEN + "New commit pushed!" + Fore.RESET)

            print(Fore.YELLOW + "Making new tag..." + Fore.RESET)
            subprocess.run(["git", "tag", "-a", new_tag, "-m", f"Release @egamings/wlc-engine {new_tag}"])
            print(Fore.YELLOW + "Pushing new tag..." + Fore.RESET)
            output = subprocess.run(["git", "push", "origin", new_tag], check=True)
            print(Fore.GREEN + "New tag pushed!" + Fore.RESET)

        except subprocess.CalledProcessError as e:
            print(Fore.RED + "Command failed with exit code:", e.returncode, Fore.RESET)
            print(Fore.RED + "Error:", e, Fore.RESET)

        print(Fore.GREEN + "Done!" + Fore.RESET)
    else:
        error_message()
        make_hotfix()


# Создание релиза переводов
def make_translate_release(action, branch):
    clean_temp()
    clone_project(lang_repo)
    check_branch(branch, temp_folder)
    print(Fore.YELLOW + "Making new translate tag..." + Fore.RESET)
    new_tag = ".".join(map(str, change_version(action, parse_version(get_version("translate")))))
    set_version("translate", new_tag)
    push_branch(branch, new_tag, "translate")
    clean_temp()
    return new_tag


# Обновление версии переводов
def update_language_pack(branch):
    print(Fore.YELLOW + "Switch to the remote branch" + Fore.RESET)
    subprocess.run(["git", "fetch", "origin"])
    subprocess.run(["git", "switch", f"remotes/origin/{branch}"])
    print(Fore.GREEN + "Done" + Fore.RESET)

    clean_temp()
    clone_project(lang_repo)
    new_tag = get_version("translate")
    clean_temp()

    print(Fore.YELLOW + f"Update language pack to the {new_tag} version" + Fore.RESET)
    set_version("langpack", new_tag)
    subprocess.call(["./node20.sh", "wlc-engine", "npm", "cache", "clean", "-f"], cwd=os.path.expanduser("~/Projects/wlc"))
    subprocess.call(["./node20.sh", "wlc-engine", "npm", "update", "@egamings/wlc-engine-translate", "-f"], cwd=os.path.expanduser("~/Projects/wlc"))
    print(Fore.GREEN + "Done" + Fore.RESET)

    print(Fore.YELLOW + "Commit and push changes..." + Fore.RESET)
    subprocess.run(["git", "add", "package.json", "package-lock.json"])
    subprocess.run(["git", "commit", "-m", f"SCR #123456 - update: language pack to the {new_tag} version"])
    subprocess.run(["git", "push", "origin", f"HEAD:{branch}"])
    print(Fore.GREEN + "Done" + Fore.RESET)

    print(Fore.YELLOW + "Switch to the local branch and pull changes" + Fore.RESET)
    subprocess.run(["git", "switch", branch])
    subprocess.run(["git", "pull", "origin", branch])
    print(Fore.GREEN + f"Done. Dependency of language pack updated to the {new_tag} version!" + Fore.RESET)


# Создание релиза
def make_release(action, branch):
    print(Fore.YELLOW + """
        ------------------------------------------------
        What do you want to do?
        ------------------------------------------------
        (1) If you want make and update language pack
        (2) If you want just update language pack
        (nothing) If you don`t want anything
        ------------------------------------------------
        """ + Fore.RESET)

    choice = input(Fore.YELLOW + "Write your choise: " + Fore.RESET)

    if choice == "1" or choice == "2":

        if choice == "1":
            make_translate_release(action, branch)

            print(Fore.YELLOW + "Waiting for the jenkins job to complete... Check your self, please" + Fore.RESET)
            time.sleep(25)
            job = input(Fore.YELLOW + "If jankins job is done press 'y': " + Fore.RESET)

            if job == "y":
                print(Fore.YELLOW + "Done!" + Fore.RESET)

        update_language_pack(branch)

    print(Fore.YELLOW + "Switch to the remote branch" + Fore.RESET)
    subprocess.run(["git", "fetch", "origin"])
    subprocess.run(["git", "switch", f"remotes/origin/{branch}"])
    print(Fore.GREEN + "Done" + Fore.RESET)

    print(Fore.YELLOW + "Making new engine tag..." + Fore.RESET)
    new_tag = make_tag(action)
    set_version("engine", new_tag)
    print(Fore.GREEN + f"Done. New tag is {new_tag}" + Fore.RESET)

    if branch in ["develop", "master"]:
        print(Fore.YELLOW + "Making change log..." + Fore.RESET)
        subprocess.run(["./node20.sh", "wlc-engine", "npm", "run", "gulp", "change-logs", f"-- --tag={new_tag}"], cwd=os.path.expanduser("~/Projects/wlc"))
        subprocess.run(["./node20.sh", "wlc-engine", "npm", "run", "gulp", "translations-logs"], cwd=os.path.expanduser("~/Projects/wlc"))
        print(Fore.GREEN + "Done" + Fore.RESET)


    print(Fore.YELLOW + "Commit and push changes..." + Fore.RESET)
    subprocess.run(["git", "add", "src/docs/content", "package.json"])
    subprocess.run(["git", "commit", "-m", f"Updated for release @egamings/wlc-engine {new_tag}"])
    subprocess.run(["git", "tag", "-a", new_tag, "-m", f"Release @egamings/wlc-engine {new_tag}"])
    subprocess.run(["git", "push", "origin", f"HEAD:{branch}", "--follow-tags"])
    print(Fore.GREEN + "Done" + Fore.RESET)

    print(Fore.YELLOW + "Switch to the local branch and pull changes" + Fore.RESET)
    subprocess.run(["git", "switch", branch])
    subprocess.run(["git", "pull", "origin", branch])
    print(Fore.GREEN + "Done. New release ready" + Fore.RESET)


# Апдейт версии wlc-core
def change_core_version(project):
    clean_temp()
    clone_project(project["repository"])
    branch = input(Fore.YELLOW + "What devcasino branch do you want to update? Type 'develop' or 'master': " + Fore.RESET)
    check_branch(branch, temp_folder)

    print(Fore.YELLOW + "Start to update wlc-core version..." + Fore.RESET)
    with open(os.path.expanduser(f"{temp_folder}composer.json"), "r") as j:
        json_data = json.load(j)

    current_core_version = json_data["require"].get("egamings/wlc_core")
    print(Fore.GREEN + f"Current wlc-core version: {current_core_version}" + Fore.RESET)

    new_core_version = input(Fore.YELLOW + "Insert new wlc-core version: " + Fore.RESET)
    json_data["require"].update({"egamings/wlc_core": new_core_version})

    with open(os.path.expanduser(f"{temp_folder}composer.json"), "w") as j:
        json.dump(json_data, j, indent=4)
    print(Fore.GREEN + "Done" + Fore.RESET)

    update_composer()
    new_tag = make_tag(None, branch)

    print(Fore.YELLOW + "Update project" + Fore.RESET)
    subprocess.run(["git", "add", "."], cwd=temp_folder)
    subprocess.run(["git", "commit", "-m", f"SCR #0 - update: wlc-core to the {new_core_version} version"], cwd=temp_folder)
    subprocess.run(["git", "tag", "-a", new_tag, "-m", f"SCR #0 - update: wlc-core to the {new_core_version} version"], cwd=temp_folder)
    subprocess.run(["git", "push", "origin", branch, "--follow-tags"], cwd=temp_folder)
    print(Fore.GREEN + "Done" + Fore.RESET)

    print(Fore.GREEN + f"Done! Now new wlc-core version on current branch is", json_data["require"].get("egamings/wlc_core") + Fore.RESET)
    clean_temp()


# Создание стабильной ветки
def make_stable_branch(branch, stable_branch):
    print(Fore.YELLOW + f"Making stable release on {stable_branch} branch" + Fore.RESET)
    subprocess.run(["git", "switch", branch], cwd=temp_folder)
    subprocess.run(["git", "branch", "-D", stable_branch], cwd=temp_folder)
    subprocess.run(["git", "switch", "-c", stable_branch], cwd=temp_folder)
    subprocess.run(["git", "push", "origin", stable_branch, "--force-with-lease"], cwd=temp_folder)
    print(Fore.GREEN + "Done" + Fore.RESET)


# Обновление веток проектов
def update_projects(projects):
    print(Fore.YELLOW + """
        ---------------------------------------
        What project do you want update?
        ---------------------------------------
        (0) Update all (or press "Enter")
        (1) Update wlc_devcasino
        (2) Update wlc_devcasino_kiosk
        (3) Update sportsbook

        You can also select more than one
        item by separating them with " "(space)
        ---------------------------------------
        """ + Fore.RESET)

    choise_list = list(filter(None, input(Fore.YELLOW + "Write your choise: " + Fore.RESET).split(" ")))

    if "0" in choise_list or len(choise_list) == 0:
        projects = projects
    else:
        projects = [project for project in projects if project["id"] in choise_list]

    engine_version = get_version()
    print(Fore.YELLOW + f"Engine version {engine_version}" + Fore.RESET)

    for project in projects:
        clean_temp()
        clone_project(project["repository"])
        project_version = get_version("project")

        if project["id"] == "1" and check_format(project_version) == "release":
            print(Fore.YELLOW + f"Making stable release {project_version} branches" + Fore.RESET)

            for branch in project["branches"]:
                if branch in ["develop"]:
                    stable_branch = "scr" + project_version.replace(".", "-")
                    make_stable_branch(branch, stable_branch)

                elif branch != "develop" and branch != "master":
                    stable_branch = branch + "-s"
                    make_stable_branch(branch, stable_branch)

        for branch in project["branches"]:
            if branch in ["develop"] or branch in ["scr0-pretest"]:
                subprocess.run(["git", "switch", branch], cwd=temp_folder)
                set_version("project", engine_version)

                clear_npm_cache()
                update_npm(temp_folder)
                update_composer()

                if branch in ["develop"]:
                    new_tag = make_tag(None, branch)
                    push_branch(branch, new_tag)

                else:
                    push_branch(branch)

            else:
                small_update_branch(branch)

                if branch in ["master"]:
                    new_tag = make_tag(None, branch)
                    push_branch(branch, new_tag)

                else:
                    push_branch(branch)

        clean_temp()


# Менеджер релиза
def release_manager():
    print(Fore.YELLOW + """
        ---------------------------------------
        What do you want to do?
        ---------------------------------------
        (erc) Make engine release candidate
        (er)  Make engine release
        (eh)  Make engine hotfix
        (lrc) Make language release candidate
        (lr)  Make language release
        (ul)  Update language pack
        (cr)  Make catcasino release
        (cp)  Make catcasino patch
        (up)  Update projects
        (uwc) Update wlc core
        (dt)  Delete last tag
        (ex)  Exit (or press 'Ctrl+Z')
        ---------------------------------------
        """ + Fore.RESET)

    choice = input(Fore.YELLOW + "Write your choise: " + Fore.RESET)

    match choice:

        case "erc":
            action = "rc"
            branch = "develop"
            check_branch(branch)
            print(Fore.YELLOW + "Release candidate starting..." + Fore.RESET)
            make_release(action, branch)

        case "er":
            action = "release"
            branch = "master"
            check_branch(branch)
            print(Fore.YELLOW + "Release starting..." + Fore.RESET)
            make_release(action, branch)

        case "eh":
            action = "hotfix"
            make_hotfix(action)
            print(Fore.GREEN + "Hotfix created!" + Fore.RESET)

        case "lrc":
            action = "rc"
            branch = "develop"
            make_translate_release(action, branch)
            print(Fore.GREEN + "Language release candidate created!" + Fore.RESET)

        case "lr":
            action = "release"
            branch = "master"
            make_translate_release(action, branch)
            print(Fore.GREEN + "Language release created!" + Fore.RESET)

        case "ul":
            branch = "develop"
            update_language_pack(branch)
            print(Fore.GREEN + "Language pack updated!" + Fore.RESET)

        case "cr":
            action = "catcasino"
            branch = "catcasino"
            check_branch(branch)
            print(Fore.YELLOW + "Catcasino release starting..." + Fore.RESET)
            make_release(action, branch)

        case "cp":
            action = "patch"
            branch = "catcasino"
            check_branch(branch)
            print(Fore.YELLOW + "Catcasino patch process starting..." + Fore.RESET)
            make_release(action, branch)

        case "up":
            update_projects(projects)
            print(Fore.GREEN + "Projects updated!" + Fore.RESET)

        case "uwc":
            change_core_version(projects["id" == "1"])
            print(Fore.GREEN + "WLC Core updated!" + Fore.RESET)

        case "dt":
            action = "deltag"
            del_local_tag()
            del_remote_tag()
            old_version = make_tag(action)
            set_version("engine", old_version)

        case "ex":
            print(Fore.GREEN + "Good job. Bye bye. :-)" + Fore.RESET)

        case "t":
            # Choise for testing things
            branch = "master"
            update_language_pack(branch)

        case _:
            error_message()

    start()


# Запуск скрипта
def start():
    print(Fore.GREEN + "Release manager starting..." + Fore.RESET)
    release_manager()


start()
