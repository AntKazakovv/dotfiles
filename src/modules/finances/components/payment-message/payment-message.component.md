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

# Payment Message Component
Компонент предназначен для вывода информации по криптовалютам в **[deposit-withdraw.component](../components/DepositWithdrawComponent.html)**   

## Состав компонента

* Поле с адресом кошелька для внесения средств
* QR код   

Также выводится информация об особенностях операций с данной криптовалютой.

### Поле с адресом кошелька для внесения средств
Выводится адрес для перечисления денежных средств. Имеет формат *только для чтения*. Справа кнопка, которая копирует этот адрес в буфер обмена.   
![Deposit-Withdraw Overview](../src/docs/assets/finances/payment-message/step2.png) 

> При совершении депозита с помощью криптовалюты, сначала надо ввести адрес кошелька для вывода средств. В зависимости от настроек криптовалюты в fundist этот номер либо закрепляется за пользователем и в дальнейшем его нельзя изменить, либо при выводе средств будет выведено дополнительное поле для указания адреса для вывода средств. 
### QR код
Формируется на основе адреса криптокошелька. Можно либо воспользоваться адресом из поля с адресом кошелька для внесения средств, либо сделать оплату по QR коду. Генерируется с помощью **[chart.googleapis.com/chart?]()** 
 
 </div>
</div>
