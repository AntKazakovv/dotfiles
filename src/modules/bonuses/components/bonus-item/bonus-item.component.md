# Bonus Item Component

## Params
Interface [IBonusItemCParams](/docs/compodoc/interfaces/IBonusItemCParams.html#info)

```typescript
export const defaultParams: IBonusItemCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-item',
    class: 'wlc-bonus-item',
    common: {
        imageByType: false,
        showAdditionalImage: false,
        showBonusTag: true,
        hideDescription: false,
        iconMoreBtn: true,
        hideChooseBtn: true,
        iconsPath: '/gstatic/bonuses/icons/',
        nameClamp: 1,
        descriptionClamp: 2,
        usePreviewBonus: false,
        useActionButtons: true,
        promoLinks: {
            deposit: {
                state: 'app.profile.cash.deposit',
            },
            play: {
                state: 'app.catalog',
                params: {
                    category: 'casino',
                },
            },
        },
    },
}
```
