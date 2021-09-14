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

# PIQ-Cashier Component 
Компонент отображает iFrame c платежными методами PaymentIQ Cashier.

Показывается если платежная система в названии содержит ***"paymentiq cashier"*** в **fundist**. Это название (поле name) преобразовывается на *backend* в соответствующий `alias`, который используется для фильтрации в **payment-system.model.ts**   

Если в `customParams` платежной системы приходит параметр `provider`, то будет показываться только указанный платежный метод кассы. 

Пример данных с backend:
```JSON
{
    "id": "215",
    "name": "PaymentIQ Cashier Interac",
    "alias": "paymentiq_cashier_interac",
    "customParams": {
        "merchant_id": "100243999",
        "provider": "interac"
    },    
}
```

Принадлежность к платежному методу кассы устанавливается в модели **payment-system.model.ts**:
```typescript
if (this.alias.includes('paymentiq_cashier')) {
    this.isCashier = true;
}
```
Проверка этого условия осуществляется в **finances.service.ts**:
```typescript
if (currentSystem.isCashier) {
    await this.injector.get(PIQCashierService).openPIQCashier(method, currentSystem, amount);
    return [PIQCashierResponse];
}
```

Для совершения депозита запускается модальное окно с *iFrame* кассы, куда в соответствии с настройками загружается список платежных систем. Дальнейшее взаимодействие происходит между кассой и *backend*.  

</div>
</div>
