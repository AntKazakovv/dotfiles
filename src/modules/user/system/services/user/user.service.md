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


## Description

Service is required for authorisation, registration, validation of user input data and working with user's profile.

Also for storing authentication status, general information about user and his profile.

Below is down description of major events in the `user.service.ts`:

* `USER_INFO` - user's data were received from backend, **1 request per 10 seconds** (`info.model.ts`);
* `USER_INFO_ERROR` - data weren't received;

* `PROFILE_CREATE` - profile was created;
* `PROFILE_CREATE_ERROR` - failed to create profile;
* `PROFILE_UPDATE` - profile data were updated;
* `USER_PROFILE` -  profile data were received from backend, profile data were updated (`profile.model.ts`);

* `REGISTRATION_BEGIN` - begin of registration, validation of input data is successful;
* `REGISTRATION_ERROR` - failed to register profile;
* `REGISTRATION_COMPLETE` - registration completed. It's implied that the `REGISTRATION_BEGIN` & `PROFILE_CREATE` events have occurred before;
* `REGISTRATION_CONFIRM` - registration confirmed (at this moment fast registration completed at `REGISTRATION_COMPLETE`);
* `REGISTRATION_CONFIRM_ERROR` - failed to confirm registration;

* `LOGIN` - authentication is successful. In addition to login on the site, this event can occur during fast registration, social registration, after email confirmation и password recovery;
* `LOGIN_ERROR` - failed to login;
* `LOGOUT` - logout;

* `PROFILE_RESTORE` - a form's data (email, phone) were sent to recover password;
* `PROFILE_RESTORE_ERROR` - failed to sent data;
* `VALIDATE_RESTORE_CODE` - verification code was checked;
* `VALIDATE_RESTORE_CODE_ERROR` -  failed to check verification code;
* `PROFILE_PASSWORD` - new password were sent;
* `PROFILE_PASSWORD_ERROR` - failed to send new password;

* `NEW_PASSWORD` - password recovery form was sent from profile;
* `NEW_PASSWORD_ERROR` - failed to send new password from profile;

</div>
<div class="tab-pane fade" id="c-russian">


## Описание

Сервис необходим для авторизации, регистрации, валидации вводимых пользователем данных и работы с профилем пользователя.

А также для хранение статуса аутентификации, основной информации о пользователе и его профиле.

Ниже описание ключевых событий в `user.service.ts`:

* `USER_INFO` - пришли данные пользователя с бека, **запрос раз в 10 секунд** (`info.model.ts`);
* `USER_INFO_ERROR` - не удалось обновить данные;

* `PROFILE_CREATE` - создан профиль;
* `PROFILE_CREATE_ERROR` - не удалось создать профиль;
* `PROFILE_UPDATE` - поля профиля обновлены;
* `USER_PROFILE` - пришли данные профиля с бека, поля профиля обновлены (`profile.model.ts`);

* `REGISTRATION_BEGIN` - начало регистрации, валидация данных успешна;
* `REGISTRATION_ERROR` - не удалось зарегистрировать;
* `REGISTRATION_COMPLETE` - регистрация завершена, подразумеватся, что до этого были события `REGISTRATION_BEGIN` и `PROFILE_CREATE`;
* `REGISTRATION_CONFIRM` - подтверждение регистрации (на данный момент быстрая регистрация заканчивается на `REGISTRATION_COMPLETE`);
* `REGISTRATION_CONFIRM_ERROR` - ошибка при подтверждении регистрации;

* `LOGIN` - аутентификация успешна. Помимо непосредственно логина может возникать при быстрой регистрации, социальной регистрации, после подтверждения почты и восстановления пароля;
* `LOGIN_ERROR` - ошибка при попытке зайти в приложение;
* `LOGOUT` - выход из приложения;
* `LOGOUT_ERROR` - не удалось выйти из приложения;

* `PROFILE_RESTORE` - отправка формы (почта, телефон) на восстановление пароля;
* `PROFILE_RESTORE_ERROR` - не удалось отправить данные;
* `VALIDATE_RESTORE_CODE` - проверка кода для восстановления пароля;
* `VALIDATE_RESTORE_CODE_ERROR` - не удалось проверить код;
* `PROFILE_PASSWORD` - отправка формы с новым паролем;
* `PROFILE_PASSWORD_ERROR` - не удалось отправить данные;

* `NEW_PASSWORD` - отправка формы на новый пароль из профиля;
* `NEW_PASSWORD_ERROR` - не удалось отправить данные.


</div>
</div>
