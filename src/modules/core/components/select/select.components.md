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
