## Zoho chat

Use the following settings to use Zoho chat

`setUserDetails: true` - if need complete user field (id)

`excludeStates: ['app.gameplay']` - exclude state names - wiget will not show on this states

`fundistProdLink: 'www2.fundist.org'` - prod fundist link

```
export const $base: IBaseConfig = {
    ...
    livechat: {
        type: 'zoho',
        code: 'your-chat-code',
        setUserDetails: true,
        excludeStates: ['app.gameplay'],
        fundistProdLink: 'www2.fundist.org',
    }
}
```
