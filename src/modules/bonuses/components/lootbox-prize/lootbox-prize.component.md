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

# Lootbox Prize Component
The component of the prize card that can fall out in the loot box

## Params
Interface [ILootboxPrizeCParams](/docs/compodoc/interfaces/ILootboxPrizeCParams.html#info)

- **prize** - модель лутбокс приза
- **iconPath** - путь до иконки
- **nameClamp** - максимальное количество строк, которое может занимаьб название 

```typescript
export const defaultParams: Partial<ILootboxPrizeCParams> = {
    moduleName: 'bonuses',
    componentName: 'wlc-lootbox-prize',
    class: 'wlc-lootbox-prize',
    iconPath: '/bonuses/icons/lootbox.svg',
    nameClamp: 2,
};
```
</div>
<div class="tab-pane fade" id="c-russian">

# Lootbox Prize Component
Компонент карточки приза, который может выпасть в лутбоксе


## Параметры
Interface [ILootboxPrizeCParams](/docs/compodoc/interfaces/ILootboxPrizeCParams.html#info)

- **prize** - модель лутбокс приза
- **iconPath** - путь до иконки
- **nameClamp** - максимальное количество строк, которое может занимаьб название 

```typescript
export const defaultParams: Partial<ILootboxPrizeCParams> = {
    moduleName: 'bonuses',
    componentName: 'wlc-lootbox-prize',
    class: 'wlc-lootbox-prize',
    iconPath: '/bonuses/icons/lootbox.svg',
    nameClamp: 2,
};
```
</div>
</div>
