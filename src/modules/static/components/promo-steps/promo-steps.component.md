# Promo Steps Component
Компонент выводит промо шаги из WP, которые записаны в дополнительных полях в посте со слагом **"promo-steps"**.<br/>
Шаг может быть просто текстом, ссылкой или кнопкой открывающей модальное окно.<br/>
По умолчанию ожидается 3 шага. Если их больше, то нужно редактировать scss т.к. шаги выводятся в 3 колонки.<br/>
Пример настройки можно псмотреть в WP devcasino на тесте или куа.

## Настройка промо шагов
Перед созданием кастомного поля должны быть включены плагины: **ACF to REST API, Advanced Custom Fields, Advanced Custom Fields: qTranslate, qTranslate-X**.<br/>
После включения плагинов в меню появится пункт настройки и создания кастомных полей.<br/>
Нужно создать группу, которая должна иметь название **"Promo steps"** и содержать поле **"Steps"** типа **"Group"**.

![Menu](/src/docs/assets/promo-steps/image-add-fields.png)

***

В **"Steps"** нужно создать саб поля **"step"**, которые так же имеют тип **"Group"**.

![Steps](/src/docs/assets/promo-steps/image-steps.png)

***
## Настройка descriptionType 
Поле descriptionType определяет стиль кастомного поля.
Создается как и все другие поля, выбираем **'Field Type'** типа **'Select'** и в поле Choices указываем два значения **'link'** и **'action'**.
![descriptionType](/src/docs/assets/promo-steps/image-descriptionType.png)
Кроме того, чтобы стили у поля работали корректно, у него должен быть указан тип самого поля (href/sref/modal) а также в descriptionType выбран тип отображения (link/action).
![descriptionType2](/src/docs/assets/promo-steps/image-descriptionType-edit.png)
***
### Поля шага
В каждом шаге должны быть обязательные поля **"title"** и **"desc"** и опционально могут быть добавлены: 
**sref, srefParams, href, modal, visibility, order, descriptionType**.

![Prop custom fields](/src/docs/assets/promo-steps/image-labels.png)

Описание полей:
* title - заголовок. Обязательное поле.
* desc - описание. Обязательное поле.
* sref - ссылка на стейт.
* srefParams - параметры стейта.
* href - url ссылка.
* modal - id модального окна.
* order - порядковый номер.
* visibility - определяет какому пользователю показывать шаг.
* descriptionType - определяет внешний вид кнопки, может быть 'action' или 'link'. 
    * action - оформление со стрелкой без подчеркивания.
    * link - оформление без стрелки, с подчеркиванием.

Настройки **visibility**

![visibility settings](/src/docs/assets/promo-steps/image-settings-visibility.png)
