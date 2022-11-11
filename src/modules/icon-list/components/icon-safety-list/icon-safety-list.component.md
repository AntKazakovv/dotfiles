# Icon Safety List Component

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

The component was created to be able to add a list of security logos to the footer if the project needs to display them (at the request of the licensee).
## Adding a list to a project
To add a list to the project, you need to modify/rewrite the configuration of the footer section. Example (file '02.layouts.config.ts'):

```
import {ILayoutsConfig} from 'wlc-engine/modules/core/system/interfaces';
import * as componentLib from 'wlc-engine/modules/core/system/config/layouts/components';

export const $layouts: ILayoutsConfig = {
    app: {
        sections: {
            footer: {
                modify: [
                    {
                        position: 2,
                        type: 'insert',
                        component: {
                            ...componentLib.wlcIconList.safety,
                        },
                    },
                ],
            },
        },
    },
};
```

For the first footer theme in the '_app.variables.scs' file, you also need to set the '$custom Theme 1 Footer' map to set the 'usesafetyicons' field to 'true':

```
$customTheme1Footer: (
    'useSafetyIcons': true
);

```

## Replacing icons list on the project

The default icons are on gstatic, so we can only completely replace the list of icons. For example, if we want to add another icon to the project, we need to add an image to the project and update the $modules list of icons.:

```
export const $modules = {
    'icon-list': {
        components: {
            'wlc-icon-safety-list': {
                items: [
                    {
                        iconUrl: 'static/images/safety/name.ext',
                        alt: '...',
                    },
                    {
                        iconUrl: '/gstatic/safety-icons/ssl.jpeg',
                        alt: 'SSL Encryption',
                    },
                    {
                        iconUrl: '/gstatic/safety-icons/gamcare.png',
                        alt: 'GAMCARE',
                    },
                    {
                        iconUrl: '/gstatic/safety-icons/gambling_therapy.png',
                        alt: 'Gambling Therapy',
                    },
                ],
            },
        },
    },
};

</div>
<div class="tab-pane fade" id="c-russian">

Компонент создан для возможности добавления в футер списка логотипов безопасности, если у проекта есть необходимость их отображения (по требованию лицензиата).

## Добавление списка на проект
Для добавления списка в проект необходимо модифицировать/переписать конфиг секции футера. Пример (файл '02.layouts.config.ts'):

```
import {ILayoutsConfig} from 'wlc-engine/modules/core/system/interfaces';
import * as componentLib from 'wlc-engine/modules/core/system/config/layouts/components';

export const $layouts: ILayoutsConfig = {
    app: {
        sections: {
            footer: {
                modify: [
                    {
                        position: 2,
                        type: 'insert',
                        component: {
                            ...componentLib.wlcIconList.safety,
                        },
                    },
                ],
            },
        },
    },
};
```

Для первой темы футера в файле '_app.variables.scss' также необходимо задать в мапе "$customTheme1Footer' задать полю 'useSafetyIcons' значение 'true':

```
$customTheme1Footer: (
    'useSafetyIcons': true
);

```

## Замена списка иконок на проекте

Дефолтные иконки лежат на gstatic, поэтому мы можем только полностью заменить список иконок. Например, если мы хотим добавить в проекте ещё одну иконку нам необходимо добавить картинку в проект и обновить $modules список иконок:

```
export const $modules = {
    'icon-list': {
        components: {
            'wlc-icon-safety-list': {
                items: [
                    {
                        iconUrl: 'static/images/safety/name.ext',
                        alt: '...',
                    },
                    {
                        iconUrl: '/gstatic/safety-icons/ssl.jpeg',
                        alt: 'SSL Encryption',
                    },
                    {
                        iconUrl: '/gstatic/safety-icons/gamcare.png',
                        alt: 'GAMCARE',
                    },
                    {
                        iconUrl: '/gstatic/safety-icons/gambling_therapy.png',
                        alt: 'Gambling Therapy',
                    },
                ],
            },
        },
    },
};
```
</div>
</div>
