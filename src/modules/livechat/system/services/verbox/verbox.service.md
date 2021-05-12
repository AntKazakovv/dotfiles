## Verbox livechat

Use the following settings to use Verbox livechat

`autocomplete: true` - if need complete user field (email)

`verboxSetup: {domain: 'domain.com'}` - `domain.com` your project site (for dev & test env)

``` 
export const $base: IBaseConfig = {
    ...
    livechat: {
        type: 'verbox',
        code: '65a04gfk1380c7fbflx2b6388f292c826',
        autocomplete: true,
        verboxSetup: {
            domain: 'domain.com',
        },
    }
}```
