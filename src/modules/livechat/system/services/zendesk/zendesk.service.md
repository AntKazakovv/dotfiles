# Zendesk livechat

Use the following settings to use Zendesk chat.

`zESettings` - object with chat settings. Full list is available [here](https://developer.zendesk.com/api-reference/widget/settings/)

```
export const $base: IBaseConfig = {
    ...
    livechat: {
        type: 'zendesk',
        code: 'your-chat-code',
        zESettings: {
            ...
        }
    }
}``
