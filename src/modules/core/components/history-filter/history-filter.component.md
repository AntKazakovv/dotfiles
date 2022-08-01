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

# History Filter Component 
Компонент предназначен для отображения фильтров для таблиц в мобильной версии сайта. Компонент включает в себя **кнопку** и **модальное окно**.   

### Кнопка
Кнопка отображается при размере окна *меньше 1024px*.  

![Overview](../assets/finance/history-filter-component/history-filter.png) 

Индикатор (точка сверху справа) отображается, когда применены параметры фильтрации отличные от параметров по умолчанию.  

### Модальное окно
По нажатию на кнопку открывается модальное окно c формой из **[history-filter-form.component](../components/HistoryFilterFormComponent.html)**. При открытии модального окна в форму передается дефолтное состояние для конкретного режима, которое хранится в **[historyFilterService](../injectables/HistoryFilterService.html)**. При отправке данных с формы - в этот же сервис отправляются новые данные, что отслеживает кнопка (отображает индикатор) и таблица (применяет фильтр).   

Режим `bet` :   
![Bet](../assets/finance/history-filter-component/bet.png)

Режим `bonus` :   
![Bonus](../assets/finance/history-filter-component/bonus.png)

Режим `transaction` :   
![Transaction](../assets/finance/history-filter-component/transaction.png)

Фильтры сбрасываются, когда пользователь покидает стейт с конкретной таблицей.

## Входные параметры   
| Параметр          | Значения                      | Описание                 |
| ------------------|-------------------------------|--------------------------|
| `config`          | "transaction", "bet", "bonus" | Режим отображения        |
| `defaultValues`   | {[field: string]: unknown}    | Значения по умолчанию    |
| `icon`            | string                        | Путь к иконке для кнопки |

</div>
</div>
