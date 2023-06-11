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

# Transaction History Component
Компонент предназначен для отображения истории транзакций. В desktop версии компонент включает в себя **форму фильтрации** и **таблицу**.

![Overview](../assets/finance/transaction-history-component/p2-transaction.png)  
### Форма фильтрации
При размере окна *больше 1024px* - фильтры являются частью компонета и отображаются над таблицей.  

Данные фильтруются по дате и провайдеру. Также есть возможность отображать только депозит, только снятие средств или и то и другое.

### Таблица 
* Шапка таблицы описана в **[transaction-history.params.ts](../interfaces/ITransactionHistoryCParams.html)**    
* В случае отсутсвия данных - выводится текст из `tableData.noItemsText` и картинка *gstatic/wlc/icons/empty-table-bg.svg*  

![No history](../assets/finance/transaction-history-component/p2-transaction-clear.png)

* В случае переполнения включается пагинация

![Pages](../assets/finance/transaction-history-component/p2-transaction-overflow.png) 

### Мобильная версия
Включается при размере окна *меньше 1024px*   
* Таблица переключается в мобильный режим  
* Фильтры скрываются стилями  
* Появляется кнопка, открывающая модальное окно с фильтрами, которые уже являются отдельными компонентами - **[history-filter.component](../components/HistoryFilterComponent.html)** и **[history-filter-form.component](../components/HistoryFilterFormComponent.html)**

![Mobile](../assets/finance/transaction-history-component/m-transaction.png) 

</div>
</div>
