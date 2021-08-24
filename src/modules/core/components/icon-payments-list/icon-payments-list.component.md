## Icon payments list

A wrapper that receives data about payments and gives data about icons

### Params
 * iconComponentParams - interface `IIconListCParams` settings for icon list component
 * include - List of paysystems names to be included.
 * exclude - List of paysystems to be excluded. If `all` - all default paysystems are excluded.
 * items - Custom Array of icons object

``` ts
iconComponentParams: IIconListCParams;
include?: string[],
exclude?: string[],
items?: IIconParams[];
```

### Example
```ts
{
    name: 'core.wlc-icon-payments-list',
    params: {
        exclude: ['all'],
        include: ['paycryptos_ethereum'],
        items: [
            {
                showAs: 'img',
                iconUrl: '/static/images/payments/adidas.svg',
            }
        ],
        iconComponentParams: {
            theme: 'payments',
            watchForScroll: true,
            wlcElement: 'block_payments',
            colorIconBg: 'dark',
            hideImgOnError: true,
        },
    },
},
```


        
