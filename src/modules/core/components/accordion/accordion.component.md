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

# Accordion Component

## Params
Interface [IAccordionCParams](/docs/compodoc/interfaces/IAccordionCParams.html#info)

- **items** - accordion item
- **collapseAll** - collapse all items
- **title** - title accordion
- **titleIconPath** - icon to the right of the title

```typescript
export const defaultParams: IAccordionCParams = {
    class: 'wlc-accordion',
    moduleName: 'core',
    titleIconPath: '/wlc/icons/thin-arrow.svg',
}
```
</div>
<div class="tab-pane fade" id="c-russian">

# Accordion Component

## Параметры
Интерфейс [IAccordionCParams](/docs/compodoc/interfaces/IAccordionCParams.html#info)

- **items** - элементы аккордеона
- **collapseAll** - свернуть все элементы
- **title** - название аккордеон
- **titleIconPath** - значок справа от заголовка

```typescript
export const defaultParams: IAccordionCParams = {
    class: 'wlc-accordion',
    moduleName: 'core',
    titleIconPath: '/wlc/icons/thin-arrow.svg',
}
```
</div>
</div>

