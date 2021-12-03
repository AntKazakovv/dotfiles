# Select component

## Params
- **useSearch** - Show input field for search item
- **noResultText** - Text for empty result search
- **insensitiveSearch** - Сase sensitivity

Example **useSearch** && **noResultText**:
```js
{
    name: 'core.wlc-select',
    params: {
        theme: 'vertical',
        labelText: gettext('Country'),
        common: {
            placeholder: gettext('Country'),
        },
        name: 'countryCode',
        options: 'countries',
        ...
        useSearch: true,
        insensitiveSearch: true,
        noResultText: gettext('No results available')
    },
},
```
### `$modules.user.formElements.showIcon.components`
Массив элементов форм, для которых нужно включить отображение флагов.
Для отображения флагов у элементов селектора стран и кодов телефона.

Example
```js
formElements: {
    showIcon: {
        use: true,
        components: ['phoneCode', 'countryCode'],
    }
}
```

### `$modules.user.formElements.showIcon.isoByPhoneCode`
Объект, в котором можно задать к какой стране относится код телефона.

Example
```js
formElements: {
    showIcon: {
        use: true,
        components: ['phoneCode', 'countryCode'],
        isoByPhoneCode: {
            '+7': 'kz',
        }
    }
}
```

Это необходимо в случае, когда один код телефона может относиться к нескольким странам.
Например, код +7 может быть как у России, так и у Казахстана.

Дефолтный конфиг:
```js
defaultIsoByPhoneCode: {
    '+7': 'ru',
    '+1': 'ca',
    '+44': 'im',
    '+61': 'au',
    '+212': 'ma',
},
```
