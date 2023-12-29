Icons path for each level - loyalty.config.ts

decorLeftPath - set the picture for the decor on the left and right

levelsLimit - how many levels will be shown in the component

emptyStateText - If the levels did not come, this text will be shown

```typescript
export interface ILoyaltyProgramCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    decorLeftPath?: string;
    decorRightPath?: string;
    decorImageType?: string;
    levelsLimit?: number;
    emptyStateText?: string;
    sliderParams?: ISliderCParams;
    btnParams?: IButtonCParams;
}
```

```typescript
export const defaultParams: ILoyaltyProgramCParams = {
    moduleName: 'loyalty',
    componentName: 'wlc-loyalty-program',
    class: 'wlc-loyalty-program',
    decorLeftPath: '//agstatic.com/loyalty-program/decor/left-decor.png',
    decorRightPath: '//agstatic.com/loyalty-program/decor/right-decor.png',
    levelsLimit: 4,
    emptyStateText: 'An error has occurred while loading data. Please try again later.',
    sliderParams: {
        slidesPerView: 'auto',
        spaceBetween: 10,
        allowSlideNext: true,
        followFinger: true,
        slidesOffsetBefore: 80,
        slidesOffsetAfter: 80,
        breakpoints: {
            375: {
                followFinger: true,
            },
            768: {
                spaceBetween: 10,
            },
            1024: {
                spaceBetween: 20,
            },
        },
    },
    btnParams: {
        common: {
            text: gettext('Read more'),
            typeAttr: 'button',
        },
        themeMod: 'secondary',
        wlcElement: 'button_loyalty-program',
    },
}
```
