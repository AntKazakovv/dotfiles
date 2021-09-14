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

# History Filter Form Component
Компонент предназначен для отображения формы в модальном окне через **[history-filter.component](../components/HistoryFilterComponent.html)**

![History Filter Form Component](../assets/finance/history-filter-component/transaction.png) 

## Входные параметры  
| Параметр     | Значения | Описание                   |
| -------------|----------|----------------------------|
| `formConfig` | [IFormWrapperCParams](../interfaces/IFormWrapperCParams.html) | Параметры формы            |
| `formData`   | [BehaviorSubject<IIndexing\<any>>](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md) | Данные для элементов формы |
| `onSubmit`   | (form: FormGroup) => void | Отправка данных формы      |     

</div>
</div>
