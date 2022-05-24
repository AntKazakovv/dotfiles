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

# Games Slider Component
Displays carousel of games which starts to spin on the button and stops at random game in a few seconds

## Params
Interface [IGamesSliderCParams](/docs/compodoc/interfaces/IGamesSliderCParams.html#info)

- **minTimer** - Minimal amount of milliseconds for slider rotation
- **maxTimer** - Maximal amount of milliseconds for slider rotation
- **minAmount** - Minimal amount of slides, use only odd values, recommended value - 11
- **maxAmount** - Maximal amount of slides, use only odd values
- **filter** - Sets the filter which returns games list according to filter object
- **isModal** - If true, modal is open
- **sliderParams** - Slider params
- **title** - Title for desktop
- **titleMobile** - Title for mobile
- **subtitle** - Subitle for all device types
- **buttonText** - Text for button that turns on swiper
- **errorText** - Text for error template

</div>
<div class="tab-pane fade" id="c-russian">

# Games Slider Component
Отображает карусель игр, которая начинает вращаться по нажатию на кнопку и останавливается через несколько секунд на случайной игре

## Params
Интерфейс [IGameThumbCParams](/docs/compodoc/interfaces/IGameThumbCParams.html#info)

- **minTimer** - Минимальное время прокрутки ( в миллисекундах)
- **maxTimer** - Максимальное время прокрутки ( в миллисекундах)
- **minAmount** - Минимальное количество слайдов, используйте нечетные числа (рекомендованное - 11)
- **maxAmount** - Максимальное количество слайдов, используйте нечетные числа
- **filter** - Фильтр - возвращающий список игр, удовлетворяющих объекту фильтра
- **isModal** - Показывыает, открыто ли модальное окно
- **sliderParams** - Параметры слайдера
- **title** - Заголовок для десктопа
- **titleMobile** - Заголовок для мобильной версии
- **subtitle** - Подзаголовок для всех типов устройств
- **buttonText** - Текст для кнопки, включающей слайдер
- **errorText** - Текст для шаблона ошибки

</div>
</div>
