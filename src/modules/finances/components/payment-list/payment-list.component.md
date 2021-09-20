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

# English

</div>
<div class="tab-pane fade" id="c-russian">

# Payment List Component
Компонент предназначен для вывода списка иконок платежных систем в **[deposit-withdraw.component](../components/DepositWithdrawComponent.html)**   
![Deposit-Withdraw Overview](../src/docs/assets/finances/payment-list/table.png)

Выводятся платежные системы, которые настроены на проекте в fundist.   
![Deposit-Withdraw Overview](../src/docs/assets/finances/deposit-withdraw/fundist.png)   
По умолчанию картинка картинка для платежки берется с gstatic на основе настроек `iconsType` и `colorIconBg`. Однако, если установлена картинка через настройки в **fundist** - то будет применяться она. Если никакая картинка не загрузилась, то название платежной системы будет выведено текстом.

![Deposit-Withdraw Overview](../src/docs/assets/finances/payment-list/noimage.png)

## Режим таблицы
Используется в desktop версии и в модальном окне.   
В случае если в **fundist** настройках платежной системы заполненено поле description - под таблицей выводится поле с описанием.   
![Deposit-Withdraw Overview](../src/docs/assets/finances/deposit-withdraw/description.png)

## Режим кнопки 
Используется в мобильном режиме, по нажатию на кнопку открывается модальное окно со списком платежных систем   
![Deposit-Withdraw Overview](../src/docs/assets/finances/payment-list/button.png)

## Входные параметры
| Параметр              | Значения            | Описание                                      |
| ----------------------|---------------------|-----------------------------------------------|
| `paymentType `        |'deposit' 'withdraw' | Тип операции                                  |
| `iconsType `          | 'color' 'black'     | Черная или цветная иконка                     |
| `buttonText`          | string              | Текст для режима кнопки                       |
| `showSelectedInButton`| boolean             | Показывать ли текущий выбор в кнопке          |
| `arrowIcon`           | string              | Путь к иконке стрелки                         |
| `modalSize`           | string              | Размер модального окна                        |
| `modalTitle`          | string              | Заголовок модального окна                     |
| `hideModalOnSelect`   | boolean             | Скрывать модальное окно после выбора платежки |
| `chosenMethodText`    | string              | Текст при выборе платежной системы            |
| `colorIconBg`         | 'dark' 'light'      | Выбирает тип (фон) **цветной** иконки         |
| `asModal`             | *ShowType*          | Условие отображения иконок в модальном окне   |
| `showTable `          | *ShowType*          | Условие отображения иконок в таблице          |

где *ShowType* принимает значения  `mobile`, `tablet`, `desktop` - в зависимости от типа устройства или по `breakpoint`'у. 

</div>
</div>
