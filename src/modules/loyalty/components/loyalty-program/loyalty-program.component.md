imagePath - sets path to levels images, images should be named like value of levels, and they type sets in imageType property

imageType - set the type of images that will be used in the levels

decorLeftPath - set the picture for the decor on the left and right

levelsLimit - how many levels will be shown in the component

emptyStateText - If the levels did not come, this text will be shown

```typescript
export interface ILoyaltyProgramCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    imagePath?: string;
    imageType?: string;
    decorLeftPath?: string;
    decorRightPath?: string;
    decorImageType?: string;
    levelsLimit?: number;
    emptyStateText?: string;
}
```

```typescript
export const defaultParams: ILoyaltyProgramCParams = {
    moduleName: 'promo',
    componentName: 'wlc-loyalty-program',
    class: 'wlc-loyalty-program',
    imagePath: '/gstatic/loyalty-program/',
    imageType: 'png',
    decorLeftPath: '/gstatic/loyalty-program/decor/left-decor.png',
    decorRightPath: '/gstatic/loyalty-program/decor/right-decor.png',
    levelsLimit: 4,
    emptyStateText: 'An error has occurred while loading data. Please try again later.',
}
```
