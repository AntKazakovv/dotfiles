## Livechatinc chat

Use the following settings to use Livechatinc chat

```
export const $base: IBaseConfig = {
    ...
    livechat: {
        type: 'livechatinc',
        code: 'your-chat-code',
        livechatincSetup: {
            ...
        }
    }
}```

Use the following settings to send user data to the livechat back office once every 15 minutes,
and distribute users into groups depending on the tag, as well as open the livechat window by clicking on 'Contacts'
```
export const $base: IBaseConfig = {
    ...
     livechat: {
        type: 'livechatinc',
        code: '15005499',
        onlyProd: false,
        hidden: false,
        setUserDetails: true,
        showOnlyAuth: true,
        fundistProdLink: 'www2.fundist.org',
        openChatOnContactUs: true,
        intervalSendParams: 15,
        sendUserParams: true,
        assignUsersByGroup: {
            byTags: {
                1: ['8', '4844', '1945'], // group: ['tag', 'tag' ...]
            },
            defaultGroup: '4',
        },
    }
}```
