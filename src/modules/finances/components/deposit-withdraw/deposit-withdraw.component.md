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

# Deposit Withdraw Component

### Params

- **showPaymentRules** - show/hide payment rules checkbox

Interface [IDepositWithdrawCParams](/docs/compodoc/interfaces/IDepositWithdrawCParams.html)
```ts
export const defaultParams: IDepositWithdrawCParams = {
    moduleName: 'finances',
    componentName: 'wlc-deposit-withdraw',
    mode: 'deposit',
    class: 'wlc-cash',
    showPaymentRules: true,
}
```

</div>
<div class="tab-pane fade" id="c-russian">

# Deposit Withdraw component
Компонент имеет два режима: 
* `deposit` (по-умолчанию)
* `withdraw`    

и в зависимости от него - отображает способы пополнения счета или способы вывода средств со счета пользователя. 

![Deposit-Withdraw Overview](../src/docs/assets/finances/deposit-withdraw/p2-deposit.png) 

## Title 
Заголовок принимает значение в зависимости от режима.

## 1. Choose payment option 
Для вывода иконок платежных систем используется **[payment-list.component](../components/PaymentListComponent.html)**  

## 2. Payment information
Выводит форму в зависимости от типа платежной системы и настроек, которые приходят с **fundist**. 

### Дополнительные поля
Для платежных систем, которым нужны дополнительные данные для совершения операции, в настройках платежной системы в **fundist** прописываются дополнительные поля. Эти поля обязательны к заполнению и проходят валидацию.  

![Deposit-Withdraw Overview](../src/docs/assets/finances/deposit-withdraw/addfields.png) 

Пример данных с backend:   

``` JSON   
{
    "additional": "InovapayUserId%5Blabel%5D=Inovapay+User+Id&InovapayUserId%5Bshowfor%5D=deposit&InovapaySecureId%5Blabel%5D=Inovapay+Secure+Id&InovapaySecureId%5Bshowfor%5D=deposit",
    "additionalParams": {
        "InovapayUserId": {
            "label": "Inovapay User Id",
            "showfor": "deposit",
            "skipsaving": 1
        },
        "InovapaySecureId": {
            "label": "Inovapay Secure Id",
            "showfor": "deposit"
        }
    }
}
```
> Параметр `skipsaving` отвечает за сохранение данных, которые пользователь вводил в это поле.
  
### Криптовалюты
Операции с криптовалютами проводятся через **[payment-message.component](../components/PaymentMessageComponent.html)**

### required поля
В случае если в настройках платежной системы прописаны `required` поля, то выполняется проверка - если в профиле пользователя указанные поля не заполнены, то с помощью **[add-profile-info.component](../components/AddProfileInfoComponent.html)** выводится информационное сообщение и кнопка. Кнопка открывает модальное окно с формой, где можно добавить недостающую информацию.   

![Deposit-Withdraw Overview](../src/docs/assets/finances/deposit-withdraw/addinfo.png) ![Deposit-Withdraw Overview](../src/docs/assets/finances/deposit-withdraw/addinfomodal.png)

Пример данных с backend:

``` JSON   
    "required": [
        "BankName",
        "Iban",
        "BranchCode",
        "Swift",
        "IDCountry"
    ],
```  
  
### Контейнер под **hosted fields** 
![Deposit-Withdraw Overview](../src/docs/assets/finances/deposit-withdraw/hostedfields.png)

Пример данных с backend:

``` JSON   
    "hostedFields": {
        "merchantId": "100243998",
        "url": "https://test-hostedpages.paymentiq.io/1.0.26/index.html",
        "fields": [
            {
                "type": "TEXT",
                "name": "cardHolder",
                "label": "Сard Holder"
            },
            {
                "type": "CREDITCARD_NUMBER",
                "name": "encCreditcardNumber",
                "label": "Creditcard Number"
            },
            {
                "type": "EXPIRY_MM_YYYY",
                "name": "dateExpire",
                "label": "Expiry date"
            },
            {
                "type": "CVV",
                "name": "encCvv",
                "label": "CVV"
            }
        ]
    },
``` 

### Cashier кассы агрегаторы
Работа с агрегаторами платежных методов происходит через **[piq-cashier.component](../components/PIQCashierComponent.html)**

## Описание входных параметров
По умолчанию по нажатию на кнопку Deposit, для завершения процедуры платежа, происходит редирект на сайт платежной системы. Возврат пользователя обратно на сайт казино происходит с помощью специальной ссылки со статусом платежа. Но есть возможность изменить это поведение и вместо редиректа отображать сайт платежной системы в iFrame. Для этого в файле **01.base.config.ts** надо добавить `depositInIframe: true`. Пример конфига:

```typescript
export const $base: IBaseConfig = {
    finances: {
        depositInIframe: true,
    },
}
```

## Мобильная версия
* Заголовок меняется на Cash
* Под заголовком отображается **[user-stats.component](../components/UserStatsComponent.html)**
* Появляется выбор между двумя режимами (deposit-withdrawal)
* Cписок платежек меняется на кнопку с модальным окном   

![Deposit-Withdraw Mobile](../src/docs/assets/finances/deposit-withdraw/mobile.png)

</div>
</div>
