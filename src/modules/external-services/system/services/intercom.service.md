## intercom service

Use the following settings to use Intercom

```
export const $base: IBaseConfig = {
    ...
intercom {
    apiBase: 'your app-base url';
    appId: 'your app-id code';
    sendUserInfo: true - if you need send user-data in intercom back-office;
}
}```
