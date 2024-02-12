<ul class="nav nav-tabs" role="tablist">
    <li class="active">
        <a href="#russian" role="tab" id="russian-tab" data-toggle="tab" data-link="russian">Russian</a>
    </li>
    <li>
        <a href="#english" role="tab" id="english-tab" data-toggle="tab" data-link="english">English</a>
    </li>
</ul>
<div class="tab-content">

<div class="tab-pane fade active" id="c-russian">

## Russian

# Icon component

#### Компонент выводит указанную иконку.

## Параметры

* **showSvgAsImg**:`boolean` - при значении `true`, выводит svg-иконку внутри тэга `img`. Значение по умолчанию - `false`;

---

* **fallback**:`string` - путь к иконке, которая будет загружена, если скачивание основной не удалось;

---

* **iconUrl**:`string` - адрес иконки (расположенной в директории проекта `static`, либо на сервере gstatic), например:
```ts
"/wlc/icons/icon.svg", // адрес на agstatic
"/static/images/payments/icon.svg" // адрес локально в проекте
```

---

* **iconName**:`string` - имя иконки из переменной  `$localFiles` конфига `files.config.ts` в проекте, например: `iconName: 'info'`.
Поиск иконки осуществляется сначала в проекте, затем в Engine. Адрес иконки задаётся относительно директории **src/svg**.

---

* **iconPath**:`string` - путь к иконке на gstatic, например `"/wlc/icons/check.svg"` ;

---

## Пример конфига

```ts
export const defaultParams: IIconCParams = {
    iconPath: 'wlc/icons/custom-icon.svg',
    showSvgAsImg: true,
}
```

## English
