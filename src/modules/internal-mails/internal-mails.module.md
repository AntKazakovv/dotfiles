<ul class="nav nav-tabs" role="tablist">
    <li class="active">
        <a href="#english" role="tab" id="english-tab" data-toggle="tab" data-link="english">English</a>
    </li>
    <li>
        <a href="#russian" role="tab" id="russian-tab" data-toggle="tab" data-link="russian">Russian</a>
    </li>
</ul>
<div class="tab-content">
<div class="tab-pane fade active in" id="c-english">

# The internal-mails module is responsible for internal messages to the user.

## Main parts of the module:
- a reminder bell indicating the number of unread messages in the header at resolutions > 1200px
- a reminder bell indicating the presence of an unread message in the right burger menu at resolutions < 1200px
- the "Messages" sub-item of the "Account Settings" item in the right burger menu on permissions < 1200px and the "wlc-user-info-dropdown" drop-down menu on permissions > 1200px
- sub-item "Messages" of the "Account Settings" item in the profile menu section with the message table

# Example of enabling functionality on a project:

### 1. Connecting messages in the project

File ***'config/frontend/01.base.config.ts'***:

```
export const $base: IBaseConfig = {
    ...
    profile: {
        ...
        messages: {
            use: true,
        },
    },
    ...
};
```

### 2. Adding a reminder bell to the header

#### 2.1. Adding a component to the header grid

File ***'config/frontend/02.layouts.config.ts'***:

```
import * as componentLib from 'wlc-engine/modules/core/system/config/layouts/components';

export const $layouts: ILayoutsConfig = {
    'app': {
        replaceConfig: false,
        sections: {
            header: {
                modify: [
                    {
                        type: 'insert',
                        position: 6,
                        component: {
                            ...componentLib.wlcInternalMails.notifier,
                        },
                    },
                ],
            },
        },
    },
};
```

#### 2.2. We describe the header grid for an authorized user to add a bell component to the grid:

##### 2.2.1. Creating a variable in the header map in the file ***'src/app-styles/_app.variables.scs'***:

```
$customTheme1Header: (
    'headerGridColumnsAuth': (
        375: auto minmax(0, 1fr) auto,
        1200: auto auto minmax(0, 1fr) auto auto auto,
    ),
);
```

##### 2.2.2. Creating the file ***'src/app-styles/layouts/_header.css'***:

```
@use 'engine-scss/mixins/base.mixins' as bm;

.wlc-sections__header--theme-1 {

    .container {

        .wlc-body--auth-1 & {
            @include bm.get-mq-map('grid-template-columns', $theme1Header, 'headerGridColumnsAuth');
        }
    }
}
```

##### 2.2.3. Добавляем созданный файл в ***'src/app-styles/_app.styles.scss'***:

```
@import 'layouts/header';
```

###3. If you need to remove the 'notifier' icon from the header of the right burger menu.

#### 3.1. Creating the file ***'config/frontend/05.menu.config.ts'***:

```
import {IMenuConfig} from 'wlc-engine/modules/menu';

export const $menu: IMenuConfig = {
    burgerPanel: {
        right: {
            headerMenu: {
                use: false,
            },
        },
    },
};
```

#### 3.2. Adding the created file to ***'config/frontend/index.ts'***:

```
...
export {$menu} from './05.menu.config';
```

</div>
<div class="tab-pane fade" id="c-russian">

# Модуль internal-mails отвечает за внутренние сообщения пользователю.

## Основные части модуля:
- колокольчик-напоминание с указанием количества непрочитанных сообщений в хедере на разрешениях > 1200px
- колокольчик-напоминание с указанием наличия непрочитанных сообщение в правом бургер меню на разрешениях < 1200px
- подпункт "Сообщения" пункта "Настройки аккаунта" в правом бургер меню на разрешениях < 1200px и выпадающем меню "wlc-user-info-dropdown" на разрешениях > 1200px
- подпункт "Сообщения" пункта "Настройки аккаунта" в секции меню профиля с таблицей сообщений

## Пример подключения функционала на проекте:

### 1. Подключение сообщений в проекте

Файл ***'config/frontend/01.base.config.ts'***:

```
export const $base: IBaseConfig = {
    ...
    profile: {
        ...
        messages: {
            use: true,
        },
    },
    ...
};
```

### 2. Добавление колокольчика-напоминания в хедер

#### 2.1. Добавляем компонент в сетку хедера

Файл ***'config/frontend/02.layouts.config.ts'***:

```
import * as componentLib from 'wlc-engine/modules/core/system/config/layouts/components';

export const $layouts: ILayoutsConfig = {
    'app': {
        replaceConfig: false,
        sections: {
            header: {
                modify: [
                    {
                        type: 'insert',
                        position: 6,
                        component: {
                            ...componentLib.wlcInternalMails.notifier,
                        },
                    },
                ],
            },
        },
    },
};
```

#### 2.2. Описываем сетку хедера для авторизованного пользователя, чтобы добавить компонент колокольчика в сетку:

##### 2.2.1. Создаем переменную в мапе хедера в файле ***'src/app-styles/_app.variables.scss'***:

```
$customTheme1Header: (
    'headerGridColumnsAuth': (
        375: auto minmax(0, 1fr) auto,
        1200: auto auto minmax(0, 1fr) auto auto auto,
    ),
);
```

##### 2.2.2. Создаем файл ***'src/app-styles/layouts/_header.scss'***:

```
@use 'engine-scss/mixins/base.mixins' as bm;

.wlc-sections__header--theme-1 {

    .container {

        .wlc-body--auth-1 & {
            @include bm.get-mq-map('grid-template-columns', $theme1Header, 'headerGridColumnsAuth');
        }
    }
}
```

##### 2.2.3. Добавляем созданный файл в ***'src/app-styles/_app.styles.scss'***:

```
@import 'layouts/header';
```

### 3. Если нужно удалить иконку 'notifier' из хедера правого бургер меню.

#### 3.1. Создаем файл ***'config/frontend/05.menu.config.ts'***:

```
import {IMenuConfig} from 'wlc-engine/modules/menu';

export const $menu: IMenuConfig = {
    burgerPanel: {
        right: {
            headerMenu: {
                use: false,
            },
        },
    },
};
```

#### 3.2. Добавляем созданный файл в ***'config/frontend/index.ts'***:

```
...
export {$menu} from './05.menu.config';
```

</div>
</div>
