# Dropdown Search Component

## Params
Interface [IDropdownSearchCParams](/docs/compodoc/interfaces/IDropdownSearchCParams.html#info)

- **gamesGridParams** - game Grid Viewing Options
- **scrollbarParams** - scrollbar params

```typescript
export const defaultParams: IDropdownSearchCParams = {
    moduleName: 'games',
    componentName: 'wlc-dropdown-search',
    class: 'wlc-dropdown-search',
    gamesGridParams: {
        type: 'search',
        searchFilterName: 'dropdown',
        gamesRows: 10,
        usePlaceholders: false,
        byState: false,
        showTitle: false,
        moreBtn: {
            hide: true,
            lazy: true,
        },
        noContentText: {
            default: gettext('Sorry, but nothing was found. Check the spelling or try a different name.'),
        },
        updateGridAfterFiltering: true,
    },
    scrollbarParams: {
        swiperOptions: {
            scrollbar: {
                draggable: true,
                snapOnRelease: false,
            },
        },
    },
};
```
