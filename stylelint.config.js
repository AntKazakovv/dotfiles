module.exports = {
    'syntax': 'scss',
    'plugins': [
        'stylelint-order',
    ],
    'rules': {
        'color-hex-case': ['lower', {
            'message': 'HEX цвета буквами строчными указывать следует',
            'severity': 'warning',
        }],
        'color-named': ['never', {
            'message': 'Цвета ключевыми словами нельзя писать',
        }],
        'color-no-invalid-hex': [true, {
            'message': 'HEX цвета правильно написаны быть должны',
        }],
        'font-family-name-quotes': ['always-where-recommended', {
            'message': 'В кавычки шрифта название брать не следует',
        }],
        'font-family-no-duplicate-names': [true, {
            'message': 'Шрифтов название повторять не следует',
        }],
        'function-calc-no-unspaced-operator': [true, {
            'message': 'Для calc() пробелы вокруг операторов нужны',
        }],
        'function-comma-space-after': ['always', {
            'message': 'После запятой пробел необходим',
        }],
        'function-comma-space-before': ['never', {
            'message': 'Перед запятой пробела быть не должно',
        }],
        'function-linear-gradient-no-nonstandard-direction': [true, {
            'message': 'Синтаксис градиентов стандартен: https://clck.ru/F2NE9',
        }],
        'function-max-empty-lines': [1, {
            'message': 'Пустые строки в функциях нужно убрать',
        }],
        'function-name-case': ['lower', {
            'message': 'Функций имена строчными буквами набирать следует',
            'ignoreFunctions': ['mapMerge', '/^get.*$/', '/^#{.*$/'],
        }],
        'function-whitespace-after': ['always', {
            'message': 'Всегда нужны пробелы между функциями',
        }],
        'number-leading-zero': ['always', {
            'message': 'Нуль перед точкой явно указать следует',
        }],
        'number-max-precision': [6, {
            'message': 'Максимум 6 символов после точки в десятичной дроби',
        }],
        'number-no-trailing-zeros': [true, {
            'message': 'Лишний (необязательный) нуль в дроби',
        }],
        'string-no-newline': [true, {
            'message': 'В строчных данных не должно быть переносов',
        }],
        'string-quotes': ['single', {
            'message': 'Кавычки одиночные в стилях на проекте у нас',
        }],
        'length-zero-no-unit': [true, {
            'message': 'Нулю не нужны измерения единицы',
        }],
        'time-min-milliseconds': [100, {
            'message': 'Время менее 100мс — нет смысла использовать',
        }],
        'unit-case': ['lower', {
            'message': 'Измерения единицы буквами строчными надобно',
        }],
        'unit-no-unknown': [true, {
            'message': 'Нет единиц измерения таких',
        }],
        'value-no-vendor-prefix': [true, {
            'message': 'Вендорные префиксы использовать не следует',
        }],
        'value-list-comma-newline-after': ['always-multi-line', {
            'message': 'Значения свойств переносов иметь не должны',
        }],
        'value-list-comma-newline-before': ['never-multi-line', {
            'message': 'Значения свойств переносов иметь не должны',
        }],
        'value-list-comma-space-after': ['always-single-line', {
            'message': 'В значениях после запятой пробел необходим',
        }],
        'value-list-comma-space-before': ['never', {
            'message': 'В значениях перед запятой пробел запрещен',
        }],
        'property-disallowed-list': [['text-rendering', 'float'], {
            'message': 'Свойство из чёрного списка',
        }],
        'property-case': ['lower', {
            'message': 'Свойств значение буквами строчными указывать следует',
        }],
        'property-no-unknown': [true, {
            'message': 'Такого свойства нет',
        }],
        'property-no-vendor-prefix': [true, {
            'message': 'Вендорные префиксы тут лишние, используем Autoprefixer',
        }],
        'declaration-bang-space-after': ['never', {
            'message': 'После знака восклицательного пробел убрать следует',
        }],
        'declaration-bang-space-before': ['always', {
            'message': 'Перед знаком восклицательным пробел оставить хочешь ты',
        }],
        'declaration-colon-newline-after': ['always-multi-line', {
            'message': 'Для свойств множественных каждое — на строке своей быть должно',
        }],
        'declaration-colon-space-after': ['always-single-line', {
            'message': 'Правило задавая, один пробел после двоеточия ставь',
        }],
        'declaration-colon-space-before': ['never', {
            'message': 'Правило задавая, пробел перед двоеточием не используй',
        }],
        'declaration-property-unit-disallowed-list': [{
            'font-size': ['pt'],
            'line-height': ['%'],
            '/^animation/': ['ms'],
        }, {
            'message': 'Для этого свойства данные единицы измерения в чёрном списке',
        }],
        'unit-disallowed-list': [['pt'], {
            'message': 'Данные единицы измерения в чёрном списке',
        }],
        'declaration-block-no-duplicate-properties': [true, {
            'message': 'Правила повторять не следует',
        }],
        'declaration-block-no-shorthand-property-overrides': [true, {
            'message': 'Свойство это неочевидно перебивает другое для селектора этого',
        }],
        'declaration-block-semicolon-newline-after': ['always', {
            'message': 'После точки с запятой строки перенос необходим',
        }],
        'declaration-block-single-line-max-declarations': [1, {
            'message': 'На строке одной правилу одному место есть только',
        }],
        'declaration-block-trailing-semicolon': ['always', {
            'message': 'Свойство каждое точкой с запятой заканчивать хочешь ты',
        }],
        'block-closing-brace-empty-line-before': ['never', {
            'message': 'Перед «}» пустой строки быть не должно',
        }],
        'block-closing-brace-newline-after': ['always', {
            'message': 'После «}» переносу строки быть должно',
            'ignoreAtRules': ['if', 'else', 'elseif'],
        }],
        'block-closing-brace-newline-before': ['always', {
            'message': 'Перед «}» переносу строки быть должно',
        }],
        'block-no-empty': [true, {
            'message': 'Пустые блоки писать не следует',
        }],
        'block-opening-brace-newline-after': ['always', {
            'message': 'После «{» перенос строки быть должен',
        }],
        'block-opening-brace-space-before': ['always', {
            'message': 'Перед «{» один пробел нужен',
        }],
        'selector-attribute-brackets-space-inside': ['never', {
            'message': 'В селекторе атрибута пробел использовать не следует',
        }],
        'selector-attribute-operator-space-after': ['never', {
            'message': 'В селекторе атрибута пробел писать не должен ты',
        }],
        'selector-attribute-operator-space-before': ['never', {
            'message': 'В селекторе атрибута пробел писать не должен ты',
        }],
        'selector-attribute-quotes': ['always', {
            'message': 'В селекторе атрибута кавычки писать должен ты',
        }],
        'selector-combinator-space-after': ['always', {
            'message': 'После комбинатора в селекторе пробел нужен',
        }],
        'selector-combinator-space-before': ['always', {
            'message': 'Перед комбинатором в селекторе пробел нужен',
        }],
        'selector-attribute-operator-disallowed-list': [['id'], {
            'message': 'По ID джедай стилизовать не должен',
        }],
        'selector-max-compound-selectors': [8, {
            'message': 'Селектор более чем 8-составной не хочешь ты',
            'severity': 'warning',
        }],
        'selector-no-qualifying-type': [true, {
            'message': 'Возможно, перенасыщенный селектор (использован селектор типа)',
            'ignore': ['attribute', 'class', 'id'],
            'severity': 'warning',
        }],
        'selector-pseudo-class-case': ['lower', {
            'message': 'Псевдоклассы набирать буквами строчными надо',
        }],
        'selector-pseudo-class-no-unknown': [true, {
            'message': 'Псевдокласса такого существование сомнительно',
        }],
        'selector-pseudo-class-parentheses-space-inside': ['never', {
            'message': 'Внутри скобок в псевдоселекторах пробелы ставить не следует',
        }],
        'selector-pseudo-element-case': ['lower', {
            'message': 'Псевдоэлементы набирать буквами строчными надо',
        }],
        'selector-pseudo-element-no-unknown': [true, {
            'message': 'Псевдоэлемента такого на светлой строне силы нет',
            'ignorePseudoElements': ['ng-deep'],
        }],
        'selector-type-case': ['lower', {
            'message': 'Селекторы буквами строчными набирать следует',
        }],
        'selector-type-no-unknown': [true, {
            'message': 'Селектора такого на светлой стороне силы нет',
        }],
        'selector-max-empty-lines': [0, {
            'message': 'Пустые строки в селекторах недопустимы',
        }],
        'selector-list-comma-newline-after': ['always', {
            'message': 'После запятой перенос строки ставить нужно',
        }],
        'selector-list-comma-newline-before': ['never-multi-line', {
            'message': 'Перед запятой переноса строки быть не должно',
        }],
        'selector-list-comma-space-after': ['always-single-line', {
            'message': 'После запятой пробел быть должен',
        }],
        'selector-list-comma-space-before': ['never', {
            'message': 'Перед запятой пробела быть не должно',
        }],
        'selector-pseudo-element-colon-notation': ['single', {
            'message': 'Двоеточие одинарное перед псевдоэлементом хочешь ты (кроме: placeholder, marker)',
        }],
        'rule-empty-line-before': ['always', {
            'message': 'Перед селектором вложенным строку пустую оставь',
            'ignore': ['after-comment'],
        }],
        'media-feature-colon-space-after': ['always', {
            'message': 'В @media после «:» пробелы необходимы',
        }],
        'media-feature-colon-space-before': ['never', {
            'message': 'В @media перед «:» пробелов быть не должно',
        }],
        'media-feature-name-case': ['lower', {
            'message': 'Строчные буквы использовать следует',
        }],
        'media-feature-parentheses-space-inside': ['never', {
            'message': 'Пробелы после «(» и перед «)» нельзя использовать',
        }],
        'media-feature-range-operator-space-after': ['always', {
            'message': 'Пробел после оператора диапазона ставить следует',
        }],
        'media-feature-range-operator-space-before': ['always', {
            'message': 'Пробел перед оператором диапазона ставить следует',
        }],
        'at-rule-empty-line-before': ['always', {
            'message': 'Перед @-правилами строку пустую оставь (кроме @import и @include)',
            'ignoreAtRules': [
                'import',
                'include',
                'function',
                'return',
                'if',
                'else',
                'elseif',
                'extend',
                'warn',
                'debug',
                'each',
                'for',
                'use',
            ],
            'ignore': ['after-comment'],
        }],
        'at-rule-name-case': ['lower', {
            'message': '@-правила буквами строчными набирать следует',
        }],
        'at-rule-name-space-after': ['always', {
            'message': 'После @-правила пробел ставить следует',
        }],
        'at-rule-no-unknown': [true, {
            'message': 'Неизвестное @-правило',
            'ignoreAtRules': [
                '/^at-/',
                '/^mixin/',
                '/^include/',
                '/^if/',
                '/^else/',
                '/^elseif/',
                '/^function/',
                '/^return/',
                '/^each/',
                '/^while/',
                '/^extend/',
                '/^warn/',
                '/^for/',
                '/^use/',
            ],
        }],
        'at-rule-no-vendor-prefix': [true, {
            'message': 'Для @-правил вендорные префиксы использовать не следует',
        }],
        'at-rule-semicolon-newline-after': ['always', {
            'message': 'В @-правилах после ; новая строка быть должна',
        }],
        'comment-empty-line-before': ['always', {
            'message': 'Перед комментом пустая строка требуется',
            'except': ['first-nested'],
            'ignore': ['stylelint-commands'],
        }],
        'comment-no-empty': [true, {
            'message': 'Пустой коммент убрать нужно',
        }],
        'comment-word-disallowed-list': [
            [/((Х|х)+уй|(Х|х)уе|(Х|х)уё|(Б|б)ляд|(М|м)уда|(П|п)идо|(П|п)еди|(П|п)еде|(^|\s)+(Б|б)ля)/],
            {
                'message': 'Комментарий херовый, при себе оставь его',
            },
        ],
        'indentation': [4, {
            'message': 'Использовать пробела четыре для отступов должен ты',
        }],
        'max-empty-lines': [3, {
            'message': 'Максимум линий пустых допустимо: 3',
        }],
        'max-nesting-depth': [8, {
            'message': 'Вложения боле 8 уровней — на тёмную сторону путь',
            'ignore': ['blockless-at-rules'],
            'severity': 'warning',
        }],
        'no-duplicate-selectors': [true, {
            'message': 'Селекторы дублировать не хочешь ты',
        }],
        'no-eol-whitespace': [true, {
            'message': 'Пустые символы в конце строки. Используй https://clck.ru/F2Lqq',
        }],
        'no-extra-semicolons': [true, {
            'message': 'Две точки с запятой подряд не хочешь ты',
        }],
        'no-missing-end-of-source-newline': [true, {
            'message': 'Файл пустой строкой кончаться должен: https://clck.ru/F2Lss',
        }],
        'order/order': [
            [
                'custom-properties',
                'dollar-variables',
                {
                    'type': 'at-rule',
                    'name': 'extend',
                },
                {
                    'type': 'at-rule',
                    'name': 'include',
                },
                'declarations',
                'rules',
                {
                    'type': 'at-rule',
                    'name': 'include',
                    'parameter': /[.]hover/,
                    'hasBlock': true,
                },
                {
                    'type': 'at-rule',
                    'name': 'include',
                    'parameter': /[min|max]+\(.{1,}\)/,
                    'hasBlock': true,
                },
                {
                    'type': 'at-rule',
                    'name': 'media',
                },
            ],
        ],
        'order/properties-order': [
            [
                // Custom
                'content',

                // Positioning
                'position',
                'top',
                'right',
                'bottom',
                'left',
                'z-index',

                // Box model
                'display',
                'flex',
                'flex-basis',
                'flex-direction',
                'flex-flow',
                'flex-grow',
                'flex-shrink',
                'flex-wrap',
                'grid',
                'grid-area',
                'grid-auto-rows',
                'grid-auto-columns',
                'grid-auto-flow',
                'grid-gap',
                'grid-row',
                'grid-row-start',
                'grid-row-end',
                'grid-row-gap',
                'grid-column',
                'grid-column-start',
                'grid-column-end',
                'grid-column-gap',
                'grid-template',
                'grid-template-areas',
                'grid-template-rows',
                'grid-template-columns',
                'gap',
                'align-content',
                'align-items',
                'align-self',
                'justify-content',
                'justify-items',
                'justify-self',
                'order',
                'float',
                'clear',
                'box-sizing',
                'width',
                'min-width',
                'max-width',
                'height',
                'min-height',
                'max-height',
                'margin',
                'margin-top',
                'margin-right',
                'margin-bottom',
                'margin-left',
                'padding',
                'padding-top',
                'padding-right',
                'padding-bottom',
                'padding-left',

                // Typographic
                'color',
                'font',
                'font-weight',
                'font-size',
                'font-family',
                'font-style',
                'font-variant',
                'font-size-adjust',
                'font-stretch',
                'font-effect',
                'font-emphasize',
                'font-emphasize-position',
                'font-emphasize-style',
                'font-smooth',
                'line-height',
                'direction',
                'letter-spacing',
                'white-space',
                'text-align',
                'text-align-last',
                'text-transform',
                'text-decoration',
                'text-emphasis',
                'text-emphasis-color',
                'text-emphasis-style',
                'text-emphasis-position',
                'text-indent',
                'text-justify',
                'text-outline',
                'text-wrap',
                'text-overflow',
                'text-overflow-ellipsis',
                'text-overflow-mode',
                'text-orientation',
                'text-shadow',
                'vertical-align',
                'word-wrap',
                'word-break',
                'word-spacing',
                'overflow-wrap',
                'tab-size',
                'hyphens',
                'unicode-bidi',
                'columns',
                'column-count',
                'column-fill',
                'column-gap',
                'column-rule',
                'column-rule-color',
                'column-rule-style',
                'column-rule-width',
                'column-span',
                'column-width',
                'page-break-after',
                'page-break-before',
                'page-break-inside',
                'src',

                // Visual
                'list-style',
                'list-style-position',
                'list-style-type',
                'list-style-image',
                'table-layout',
                'empty-cells',
                'caption-side',
                'background',
                'background-color',
                'background-image',
                'background-repeat',
                'background-position',
                'background-position-x',
                'background-position-y',
                'background-size',
                'background-clip',
                'background-origin',
                'background-attachment',
                'background-blend-mode',
                'outline',
                'outline-width',
                'outline-style',
                'outline-color',
                'outline-offset',
                'box-shadow',
                'box-decoration-break',
                'transform',
                'transform-origin',
                'transform-style',
                'backface-visibility',
                'perspective',
                'perspective-origin',
                'visibility',
                'cursor',
                'opacity',
                'filter',
                'isolation',
                'backdrop-filter',
                'mix-blend-mode',

                // Animation
                'transition',
                'transition-delay',
                'transition-timing-function',
                'transition-duration',
                'transition-property',
                'animation',
                'animation-name',
                'animation-duration',
                'animation-play-state',
                'animation-timing-function',
                'animation-delay',
                'animation-iteration-count',
                'animation-direction',
                'animation-fill-mode',

                // Misc
                'appearance',
                'clip',
                'clip-path',
                'counter-reset',
                'counter-increment',
                'resize',
                'user-select',
                'nav-index',
                'nav-up',
                'nav-right',
                'nav-down',
                'nav-left',
                'pointer-events',
                'quotes',
                'touch-action',
                'will-change',
                'zoom',
                'fill',
                'fill-rule',
                'clip-rule',
                'stroke',
            ],
        ],
    },
};
