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

# Bet History Component
Компонент предназначен для отображения истории ставок. В desktop версии компонент включает в себя **форму фильтрации** и **таблицу**.

![Overview](../assets/finance/bet-history-component/p2-main.png) 

### Форма фильтрации
При размере окна *1024px и больше* - фильтры являются частью компонета и отображаются над таблицей. 

Данные фильтруются по дате и провайдеру.

### Таблица 
* Шапка таблицы описана в **[bet-history.params.ts](../interfaces/IHistoryFilterCParams.html)**   
* В случае отсутсвия данных - выводится текст *"No bet history."* и картинка *gstatic/wlc/icons/empty-table-bg.svg*   

![No history](../assets/finance/bet-history-component/p2-clear.png)
* В случае переполнения включается пагинация   
  
![Pages](../assets/finance/bet-history-component/p2-overflow.png)

### Мобильная версия
Включается при размере окна *меньше 1024px*   
* Таблица переключается в мобильный режим  
* Фильтры скрываются стилями  
* Появляется кнопка, открывающая модальное окно с фильтрами, которые уже являются отдельными компонентами - **[history-filter.component](../components/HistoryFilterComponent.html)** и **[history-filter-form.component](../components/HistoryFilterFormComponent.html)**

![Mobile](../assets/finance/bet-history-component/m-mobile.png) 

</div>
</div>
