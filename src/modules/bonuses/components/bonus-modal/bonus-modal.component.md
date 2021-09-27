# Bonus Modal Component

## Params
Interface [IBonusModalCParams](/docs/compodoc/interfaces/IBonusModalCParams.html#info)

- **bonus** - object "Bonus"
- **iconType** - extension icons
- **iconsPath** - path to the folder with icons
- **fallback** - object with settings for backup icons
  - **iconType** - expanding the icon to replace
  - **IconsPath** - path to the folder with icons to replace
- **useIconBonusImage** - show/hide bonus icon
- **bgImage** - default background image

```typescript
export const defaultParams: IBonusModalCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-modal',
    class: 'wlc-bonus-modal',
    iconType: 'svg',
    iconsPath: '/gstatic/bonuses/icons/',
    fallback: {
        iconType: 'svg',
        IconsPath: '/gstatic/bonuses/icons/',
    } ,
    useIconBonusImage: true,
    bgImage: '/gstatic/wlc/bonuses/modal-bonus-default.png',
}
```
