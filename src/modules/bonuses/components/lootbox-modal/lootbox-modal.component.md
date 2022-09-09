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

# Lootbox Modal Component
In the default profile, after subscribing to a loot box, it is displayed in the swiper in the dashboard.
In the first profile, after subscribing to a loot box, it goes into inventory.
**If the inventory is not enabled, then we will not see the lootbox anywhere!!!**

## Params
Interface [ILootboxModalCParams](/docs/compodoc/interfaces/ILootboxModalCParams.html#info)

- **bonus** - model "Bonus"
- **totalSlides** - total number of slides
- **sliderParams** - object with params for slider

```typescript
export const defaultParams: ILootboxModalCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-lootbox-modal',
    class: 'wlc-lootbox-modal',
    totalSlides: 29,
    sliderParams: {
        swiper: {
            slidesPerView: 3,
            initialSlide: 2,
            spaceBetween: 10,
            speed: 3500,
            centeredSlides: true,
            centeredSlidesBounds: true,
            enabled: false,
        },
    },
}
```
</div>
<div class="tab-pane fade" id="c-russian">

# Lootbox Modal Component
В дефолтном профиле, после подписки на лутбокс, он отображается в свайпере в дашборде.  
В первом профиле, после подписки на лутбокс, он попадает в инвентарь.  
**Если инвентарь не включить, то лутбокс мы нигде не увидим!!!**

## Параметры
Интерфейс [ILootboxModalCParams](/docs/compodoc/interfaces/ILootboxModalCParams.html#info)

- **bonus** - модель "Бонус"
- **totalSlides** - общее количество слайдов
- **sliderParams** - объект с параметрами для слайдера

```typescript
export const defaultParams: ILootboxModalCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-lootbox-modal',
    class: 'wlc-lootbox-modal',
    totalSlides: 29,
    sliderParams: {
        swiper: {
            slidesPerView: 3,
            initialSlide: 2,
            spaceBetween: 10,
            speed: 3500,
            centeredSlides: true,
            centeredSlidesBounds: true,
            enabled: false,
        },
    },
}
```
</div>
</div>


