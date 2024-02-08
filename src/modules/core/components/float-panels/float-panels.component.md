<ul class="nav nav-tabs" role="tablist">
    <li>
        <a href="#english" role="tab" id="english-tab" data-toggle="tab" data-link="english">English</a>
    </li>
        <li class="active">
        <a href="#russian" role="tab" id="russian-tab" data-toggle="tab" data-link="russian">Russian</a>
    </li>
</ul>


### Russian

<div class="tab-content">

<div class="tab-pane fade active" id="c-russian">


# Float-panels Component

Компонент-обертка для `burger-panel`.
Панель имеет два типа отображения:

- выплывающая, содержит бэкдроп и блок с секциями
- раскрывающаяся, не имеет бэкдропа, но имеет фиксированное _раскрытое_/_компактное_ состояние.



## Отображение

SCR1-VAR1 - `'left-def'`

![](../../../../docs/assets/core/float-panel/panel_profil_scr1-var1.png)

SCR1-VAR2 - `'left-v2'`

![](../../../../docs/assets/core/float-panel/panel_profil_scr1-var2.png)

SCR2-VAR1 - `'left-def'`

![](../../../../docs/assets/core/float-panel/panel_profil_scr2-var1.png)

SCR2-VAR2 - `'left-v2'`

![](../../../../docs/assets/core/float-panel/panel_profil_scr2-var2.png)

MOBILE - `'left-mobile'`

![](../../../../docs/assets/core/float-panel/panel_mobile_left.png)

MOBILE - `'right'`

![](../../../../docs/assets/core/float-panel/panel_mobile_profile-right.png)


## Входящие параметры

```typescript
export interface IFloatPanelsCParams extends IComponentParams <string, string, string> {
    panels?: IIndexing<IBurgerPanelCParams>;
}

export const defaultParams: IFloatPanelsCParams = {
    moduleName: 'core',
    componentName: 'wlc-float-panels',
    class: 'wlc-float-panels',
    panels: {
        'left-v2': {
            type: 'left',
        },
        'left-def': {
            type: 'left',
            touchEvents: {
                use: false,
            },
        },
        'left-mobile': {
            type: 'left',
        },
        'left-fixed': {
            type: 'left-fixed',
        },
        'right-fixed': {
            type: 'right-fixed',
        },
        right: {
            type: 'right',
            title: gettext('Profile'),
        },
    },
};
```


### English
