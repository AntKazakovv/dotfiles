<ul class="nav nav-tabs" role="tablist">
    <li class="active">
        <a href="#english" role="tab" id="english-tab" data-toggle="tab" data-link="english">English</a>
    </li>
    <li>
        <a href="#russian" role="tab" id="russian-tab" data-toggle="tab" data-link="russian">Russian</a>
    </li>
</ul>
<div class="tab-content">
<div class="tab-pane fade active in" id="c-english">

## Description

Work in progress...

</div>
<div class="tab-pane fade" id="c-russian">

## Описание

Компонент формирует "скелетный" прелоадер по заданному конфигу.

>[Design](https://www.figma.com/file/lKdON4H3Of6H25t9C3gdZw/Preloaders-WLC-Template) - дизайн почти всех компонентов движка.

На данный момент у компонента 4 основных типа элементов, на основе которых собирается весь прелоадер:

| Тип        | Стили по умолчанию                   | Что подразумевает |
| ---------- | ------------------------------------ | ----------------- |
| **line**   | `height: 6px; border-radius: 100px;` | Обычный текст     |
| **title**  | `height: 20px; border-radius: 5px;`  | Заголовки         |
| **circle** | `height: 27px; border-radius: 100%;` | Круглые элементы  |
| **icon**   | `height: 100%;`                      | Содержит в себе иконку |

Отдельным типом является `block` - только этот тип служит контейнером для всех остальных элементов.
Стили `block` по умолчанию центрируют и равномерно распределяют все элементы внутри себя (`display: flex; flex-direction: column; gap: 10pxж align-items: center; justify-content: space-evenly;`).

Однако у основного блока с интерфейсом `IPreloaderBlock` есть свойство `noContainer`, которое позволяет рендерить все элементы внутри без дополнительного внешнего контейнера. Это может быть необходимо, когда требуется применить стили компонента, в который мы добавляем прелоадер.

Все элементы поддерживают кастомные классы, инлайн-стили, настройку отображения в зависимости от устройства, размеров экрана и авторизации на сайте.
Цвет фона расставляются автоматически для каждого слоя, чтобы вручную не приходилось указывать всем блокам.

Также, если требуется чтобы `circle` был адаптивным, то ему можно указать свойство `equalSize` принимающее два параметра `width` или `height`. К примеру, `equalSize: 'width'` означает, что ширина будет пересчитываться.

### Примеры
Карточка имеет разные по величине высоту и ширину, поэтому нельзя им просто указать одинаковый относительный размер:
```typescript
const example: IPreloaderBlock = {
    type: 'block',
    style: {
        width: '100px',
        height: '200px',
    },
    elements: [
        {
            type: 'circle',
            equalSize: 'width',
            styles: {
                height: '33%'
            },
        },
    ],
};
```

Простой по дизайну компонент можно описать в конфиге, ограничившись инлайн-стилями:
```typescript
 const example: IPreloaderBlock = {
            type: 'block',
            elements: [
                {
                    type: 'block',
                    amount: 3, //  будет 3 таких блока
                    display: {
                        mobile: true,
                    },
                    styles: {
                        'max-width': '350px',
                    },
                    elements: [
                        {
                            type: 'title',
                            styles: {
                                'width': '70px',
                            },
                        },
                        {
                            type: 'circle',
                            styles: {
                                'width': '120px',
                                'height': '120px',
                            },
                        },
                        {
                            type: 'title',
                            styles: {
                                'width': '33%',
                            },
                        },
                        {
                            type: 'title',
                            styles: {
                                'width': '110px',
                                'height': '40px',
                            },
                        },
                    ],
                },
            ]
        }
```

Если дизайн прелоадера для компонета содержит в себе несколько подблоков и уникальные стили почти для каждого элемента, то лучше всего будет указать класс и добавить стили к стилям компонента.

Конфиг:
```typescript
const example: IPreloaderBlock = {
                type: 'block',
                customClass: 'wlc-preloader__block--bonus',
                amount: 4,
                display: {
                    mobile: false,
                },
                elements: [
                    {
                        type: 'block',
                        elements: [
                            {
                                type: 'title',
                                amount: 3,
                            },
                            {
                                type: 'line',
                                amount: 3,
                            },
                        ],
                    },
                    {
                        type: 'block',
                        elements: [
                            {
                                type: 'circle',
                            },
                        ],
                    },
                ],
            },
```
Styles:
```scss
    ::ng-deep {

        .wlc-preloader__block--bonus {
            @include bm.get-mq-map('height', $preloaderPromo, 'elementHeight');

            flex-direction: row;
            gap: 0;

            .wlc-preloader__element--block {
                align-items: flex-start;
                justify-content: flex-start;
                height: 100%;
                border-radius: unset;

                &:nth-child(1) {
                    width: ef.get-value($preloaderPromo, 'blockTextWidth');
                    padding: ef.get-value($preloaderPromo, 'blockTextPadding');
                    background: transparent;


                    .wlc-preloader__element--title:nth-child(1) {
                        width: ef.get-value($preloaderPromo, 'titleShortWidth');
                        border-radius: ef.get-value($preloaderPromo, 'titleShortRadius');
                        margin-bottom: ef.get-value($preloaderPromo, 'titleMarginBottom');
                    }

                    .wlc-preloader__element--title:nth-child(3) {
                        width: ef.get-value($preloaderPromo, 'titleWidth');
                        margin-bottom: ef.get-value($preloaderPromo, 'titleMarginBottom');
                    }

                    .wlc-preloader__element--line:nth-child(4) {
                        width: ef.get-value($preloaderPromo, 'lineLongWidth');
                    }

                    .wlc-preloader__element--title:nth-child(2),
                    .wlc-preloader__element--line:nth-child(5),
                    .wlc-preloader__element--line:nth-child(6) {
                        width: ef.get-value($preloaderPromo, 'lineWidth');
                    }
                }

                &:nth-child(2) {
                    width: ef.get-value($preloaderPromo, 'blockImgWidth');
                    padding: ef.get-value($preloaderPromo, 'blockImgPadding');

                    .wlc-preloader__element--circle:nth-child(1) {
                        width: ef.get-value($preloaderPromo, 'circleSize');
                        height: ef.get-value($preloaderPromo, 'circleSize');
                    }
                }
            }
        }
    }
```

### TODO
1. Конфиг для блоков прелоадера выглядит громоздко. Упростить хотя бы для тривиального дизайна?
2. Сейчас цвета фона распределяются не оптимально. Неплохо бы добавить автоматическое определение цвета фона относительно прошлого слоя.

</div>
</div>
