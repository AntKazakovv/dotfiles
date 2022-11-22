## Tawk chat

Use the following settings to use Tawk chat

```
export const $base: IBaseConfig = {
    ...
    livechat: {
        type: 'tawkChat',
        code: '609e23c9b1d5182476b8c5e2',
        subCode: '1f5krnj80',
    }
}```


Use the following settings to load chat in different languages ​​when changing the language of the site
('en' locale as default)
```
export const $base: IBaseConfig = {
    ...
    livechat: {
        type: 'tawkChat',
        code: '609e23c9b1d5182476b8c5e2',
        subCode: '1f5krnj80',
        group: {
            'ru': {
                code: '63200c2837898912e968c6fb',
                subCode: '1gcqiv001',
            },
            'th': {
                code: '631acf0837898912e9681ba5',
                subCode: '1gcgbhesn',
            },
            'ja': {
                code: '632007cd37898912e968c685',
                subCode: '1gcqhsutu',
            },
        },
    }
}```
