# Bonus Buttons Component

## Params
Interface [IBonusButtonsCParams](/docs/compodoc/interfaces/IBonusButtonsCParams.html#info)

- **useActionButtons** - show/hide action buttons
- **promoLinks** - promo links settings
  - **deposit** - deposit settings
  - **play** - play settings

```typescript
export const defaultParams: IBonusButtonsBtnsCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-buttons',
    class: 'wlc-bonus-buttons',
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
}
```
