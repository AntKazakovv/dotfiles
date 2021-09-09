## Icon merchants list

A wrapper that receives data about merchants and gives data about icons

### Params
 * iconComponentParams - interface `IIconListCParams` settings for icon list component
 * include - List of paysystems names to be included.
 * exclude - List of paysystems to be excluded. If `all` - all default paysystems are excluded.

``` ts
iconComponentParams: IIconListCParams;
include?: string[],
exclude?: string[],
```

### Example
```ts
{
    name: 'core.wlc-icon-merchants-list',
    params: {
        exclude: ['all'],
        include: ['tomhorn','netent'],
        iconComponentParams: {
            theme: 'merchants',
            type: 'svg',
            wlcElement: 'block_merchants',
            hideImgOnError: true,
        },
    },
},
```
        
