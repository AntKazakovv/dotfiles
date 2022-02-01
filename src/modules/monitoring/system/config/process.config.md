# Конфигурации процессов для ProcessService

**Процесс** представляет собой единую цепочку действий конечного пользователя сайта или какую-либо процедуру, состоящую из нескольких действий в различных модулях/сервисах/компонентах и т.п.

Задача состоит в мониторинге и логировании результатов процесса и оповещении заинтересованных лиц.

---

## Жизненный цикл процесса ##
- `created` - процесс создан при загрузке приложения. 
    - флаг `use: true`
    <br>Конфиг обработан, пройдены минимальные проверки (на существование событий запуска процесса)
    <br>Мониторятся триггеры группы `launch`.
- `launched` - процесс запущен:
    - при загрузке приложения - флаг `launchOnAppStart: true`
    - по триггеру группы `launch`
    - по таймеру `launchAfterTimer`
    <br>Мониторятся триггеры группы `start`, т.е. начала процесса.
- `started` - процесс стартовал:
    - по триггеру группы `start`
    - по таймеру `startAfterTimer`
    <br>Мониторятся триггеры группы `success`, `fail`, `stop`.
    <br>Отправлен flog с кодом `18.0.0`.
- `succeed` - процесс успешно завершен:
    - по триггеру группы `success`
    - по таймеру `successAfterTimer`
    <br>Мониторинг остановлен.
    <br>Отправлен flog с кодом `18.0.1`.
- `failed` - процесс завершен с ошибкой:
    - по триггеру группы `fail`
    - по таймеру `failAfterTimer`
    <br>Мониторинг остановлен.
    <br>Отправлен flog с кодом `18.0.2`.
- `stopped` - процесс остановлен без ошибки:
    - по триггеру группы `stop`
    - по таймеру `stopAfterTimer`
    <br>Мониторинг остановлен.
    <br>Отправлен flog с кодом `18.0.3`.


### Таймеры
Возможен запуск события по соответствующему таймеру:
<br> `launchAfterTimer`
<br> `startAfterTimer`
<br> `successAfterTimer`
<br> `failAfterTimer`
<br> `stopAfterTimer`

Таймер начинает отсчет в момент начала мониторинга соответствующей группы триггеров.

### Рестарт процесса
Возможен перезапуск процесса после завершения по соответствующим флагам:
<br> `restartAfterFail`
<br> `restartAfterSuccess`
<br> `restartAfterStop`

### Группа триггеров ###
**Группа триггеров** представляет собой события `IEvent` и исключения, которые отменяют соответствующие события.

Событие `IEvent`:
```typescript
{
    name: string;
    data: IProcessEventData,
    type?: EventType;
    from?: string;
    status?: string;
}
```
где data представляет собой:
```typescript
{
    eventId: string;
    description?: string;
    comparator?: (triggerData: unknown, eventData: unknown) => boolean;
}
```

События сравниваются по имени `name` и по `data` (при наличии). По умолчанию сравнение объекта `data` идет по полю `eventId`. Можно также задать функцию сравнения `comparator` объектов `data` (определенного в конфиге в триггере и переданного в событие в методе `emit()` ).
В объекте `data` также может присутствовать описание события `description`, которое будет отправлено во flog'е. 

Триггеры могут быть заданы как отдельное событие `IEvent` или как объект `IProcessConfigEvent` (массив событий и их исключения).

Можно задавать исключения как для группы триггеров в целом, так и для отдельной их части.

### Исключения ###
**Исключения** могут быть заданы как события `IEvent` (при наступлении события-исключения отменяется подписка на соответствующее событие-триггер) или как параметры `configService`. По умолчанию параметр проверяется как `boolean` значение, также можно задать функцию `comparator`, которая определит является ли полученный параметр исключением для триггера.
```typescript
{
    events?: IEvent<IProcessEventData>[];
    configParams?: IProcessExceptionConfigParam[],
}
```

---

## Инструкция
Добавить конфигурацию как вложенный объект в `processConfigsCommon` (в движке, общая для всех проектов) или в `$base.monitoring.processConfigs` (конфигурация только для проекта):
В движке `src/modules/monitoring/system/config/process.config.ts`:
```typescript
export const processConfigsCommon: IProcessConfigs = {
    'new config': {
        ...
    },
```  
В проекте `config/frontend/01.base.config.ts`:
```ts
export const $base: IBaseConfig = {
    monitoring: {
        processConfigs: {
            'new config': {
                ...
            },
        },
    },
}
```  

## Параметры конфигурации:
```typescript
    'new config': {
        use: true | false // true - включить конфиг (обязательное поле)
        launchOnAppStart?: true | false //  true - запустить процесс на старте приложения
        // Триггеры соответствующих групп:
        launch?: IProcessConfigGroup;
        start?: IProcessConfigGroup;
        fail?: IProcessConfigGroup;
        success?: IProcessConfigGroup;
        stop?: IProcessConfigGroup;
        // Таймеры (мс) для выполнения соответствующего события.
        // Отсчет времени начинается в момент начала мониторинга соответствующей
        // группы триггеров.
        launchAfterTimer?: number;
        startAfterTimer?: number;
        failAfterTimer?: number;
        successAfterTimer?: number;
        stopAfterTimer?: number; 
        // Флаги рестарта после соответствующего события завершения процесса:
        restartAfterFail?: boolean;
        restartAfterSuccess?: boolean;
        restartAfterStop?: boolean;
    },
```
