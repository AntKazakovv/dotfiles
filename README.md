# WlcEngine

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12
## Development server

WLC-Engine is a Angular modules library without self-launching.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run dist` to build the project. The build artifacts will be stored in the `dist/` directory. 

## Running unit tests

Run `npm run test` to execute the unit tests.
    
## Git submodules

Run `git submodule update --init` to update [languages](https://wlcgitlab.egamings.com/wlc/wlc-engine-translate) и [shared-lib](https://wlcgitlab.egamings.com/wlc/wlc-shared-lib) git submodules 

Run `gulp engineMessages` to add all phrases from **gettext** and **translate**.
## Further help

To get more help on the **Angular CLI** use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md) and [Compodoc and Sassdoc](https://wlc-engine-docs.egamings.com/)

# Запуск compodoc локально 

Для локального запуска нужно выполнить `npm run dev:docs` и открыть `http://localhost:4201/`  
Если не запустилось, то для **VS Code** нужно установить расширение "Live Server" и открыть `docs/index.html` с его помощью.  
В **Webstorm** должно всё работать из коробки.
