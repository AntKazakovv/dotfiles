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

# Store Item Info Component
It's displayed in a modal with info about store item.

## Params
Interface [IStoreItemInfoCParams](/docs/compodoc/interfaces/IStoreItemInfoCParams.html#info)

- **title** - text for title
- **description** - description of store item
- **isDisabled** - boolean variable for whether or not to display alert about store item disabling

```typescript
export const defaultParams: Partial<IStoreItemInfoCParams> = {
    moduleName: 'store',
    componentName: 'wlc-store-item-info',
    class: 'wlc-store-item-info',
    title: '',
    description: '',
    isDisabled: false,
};
```
</div>
<div class="tab-pane fade" id="c-russian">

# Lootbox Modal Component
Отображается в модальном окне с информацией о товаре

## Параметры
Интерфейс [IStoreItemInfoCParams](/docs/compodoc/interfaces/ILootboxModalCParams.html#info)

- **title** - текст для заголовка
- **description** - описание товара
- **isDisabled** - переменная boolean, позволяющая определить, отображать или нет предупреждение о недоступности товара

```typescript
export const defaultParams: Partial<IStoreItemInfoCParams> = {
    moduleName: 'store',
    componentName: 'wlc-store-item-info',
    class: 'wlc-store-item-info',
    title: '',
    description: '',
    isDisabled: false,
};
```
</div>
</div>
