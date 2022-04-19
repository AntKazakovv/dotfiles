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

### 2. If you need to remove the 'notifier' icon from the header of the right burger menu.

#### 2.1. Creating the file ***'config/frontend/05.menu.config.ts'***:

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

#### 2.2. Adding the created file to ***'config/frontend/index.ts'***:

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

### 2. Если нужно удалить иконку 'notifier' из хедера правого бургер меню.

#### 2.1. Создаем файл ***'config/frontend/05.menu.config.ts'***:

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

#### 2.2. Добавляем созданный файл в ***'config/frontend/index.ts'***:

```
...
export {$menu} from './05.menu.config';
```

</div>
</div>
