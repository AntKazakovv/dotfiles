### Компонент выводит логотип


link - указывается путь по которому будет переход

disableLink - если значение правдиво, то клик по логотипу будет редиректить просто на главную страницу

target - открывает ссылку в новом окне(работает только в аффилейтках) или редирект на этой же странице

image - настройки логотипа

```typescript
interface ILogoCParams {
    link: string;
    uiOptions?: TransitionOptions;
    uiParams?: RawParams;
    disableLink?: boolean;
    image?: ILogoImageParams;
    target?: '_self' | '_blank';
}
```


name - указывается значение имени изображения, которое задано в файле 03.files.config, где значение свойства обьекта - путь к этому изображению

showSvgAsImg - если используется svg, то можно показать его как обычный тэг img

url - указывается изображение без указания пути в папке src/roots/static/images

urlForAltImg - изображение для альтернативной темы сайта src/roots/static/images

```typescript
interface ILogoImageParams {
    name?: string;
    showSvgAsImg?: boolean;
    url?: string;
    urlForAltImg?: string;
}
```

