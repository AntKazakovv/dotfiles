# Icon List Component
Component to display an icon list. It can be used in the following ways:

- **Merchants list.** It displays a list of merchants with icons from gstatic.

    This list can be customized by `params.common.merchant` param.

    Example:
    ```js
    {
        name: 'icon-list.wlc-icon-list',
        params: {
            theme: 'merchants',
            type: 'svg',
            common: {
                merchant: {
                    exclude: ['all'],
                    include: ['tomhorn', 'orientalgame'],
                },
            },
        },
    },
    ```

- **Payment list.** It displays a list of payment systems with icons from gstatic.

    This list can be customized by `params.common.payment` param.

    Example:
    ```js
    {
        name: 'icon-list.wlc-icon-list',
        params: {
            theme: 'payments',
            common: {
                payment: {
                    include: [
                        'Maldopay qr ref dep (2025)',
                        'skrill',
                        'neteller',
                        'Ecommpay qiwi',
                        'Accentpay 2 yandex',
                    ],
                    exclude: ['all'],
                },
            },
        },
    },
    ```

- **Custom list.** It displays a list of custom items based on `items` param. **Attention:** custom list has no it's own style theme.

    Example:
    ```js
    {
        name: 'icon-list.wlc-icon-list',
        params: {
            theme: 'any-name',
            items: [
                {
                    showAs: 'svg',
                    iconUrl: '//angular.io/assets/images/logos/angular/angular.svg',
                    href: '//angular.io',
                    alt: 'Angular',
                    title: 'Go to Angular',
                },
                {
                    iconUrl: '/gstatic/images/placeholder.png',
                    alt: 'Placeholder',
                },
                {
                    iconUrl: '/images/bonuses.svg',
                    sref: 'app.profile.loyalty-bonuses.main',
                    title: 'Go to bonuses',
                },
            ],
        },
    }
    ```
