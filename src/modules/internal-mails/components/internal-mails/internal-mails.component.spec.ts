import {
    Component,
    Input,
} from '@angular/core';
import {
    ComponentFixture,
    fakeAsync,
    flushMicrotasks,
    TestBed,
} from '@angular/core/testing';

import {DateTime} from 'luxon';
import {
    BehaviorSubject,
    Subject,
} from 'rxjs';

import {
    ActionService,
    ConfigService,
    Deferred,
    DeviceType,
    HistoryFilterService,
    IHistoryFilter,
} from 'wlc-engine/modules/core';
import {
    InternalMailsService,
} from 'wlc-engine/modules/internal-mails/system/services/internal-mails/internal-mails.service';
import {InternalMailsComponent} from './internal-mails.component';
import * as Params from './internal-mails.params';

interface IConfigServiceStub extends Partial<Omit<ConfigService, 'get'>> {
    get(): {};
}

interface IInternalMailsServiceStub extends Partial<Omit<InternalMailsService, 'mails$'>> {
    mails$: BehaviorSubject<string[]>;
}

interface IHistoryFilterServiceStub
    extends Partial<Omit<HistoryFilterService, 'getFilter' | 'setAllFilters'>> {
    setAllFilters(): void;
    getFilter(): BehaviorSubject<IHistoryFilter<string>>;
}

interface IActionServiceStub extends Partial<ActionService> {
    deviceTypeSubject: BehaviorSubject<DeviceType>;
}

describe('InternalMailsComponent', (): void => {
    let component: InternalMailsComponent;
    let fixture: ComponentFixture<InternalMailsComponent>;
    let nativeElement: HTMLElement;
    let injectParams: Params.IInternalMailsCParams;
    let defaultParams: Params.IInternalMailsCParams = Params.defaultParams;

    let configServiceStub: IConfigServiceStub;
    let internalMailsServiceStub: IInternalMailsServiceStub;
    let historyFilterServiceStub: IHistoryFilterServiceStub;
    let actionServiceStub: IActionServiceStub;

    let configGetSpy: jasmine.Spy;

    const setup = (isProfileFirst: boolean = false): void => {
        injectParams = {
            theme: 'default',
            themeMod: 'default',
            type: 'default',
            wlcElement: 'wlc-internal-mails',
        };

        configServiceStub = {
            get() {
                return {};
            },
        };
        internalMailsServiceStub = {
            mailsReady: new Deferred(),
            mails$: new BehaviorSubject([]),
            readedMailID$: new Subject(),
        };
        historyFilterServiceStub = {
            setAllFilters() {},
            getFilter() {
                return new BehaviorSubject({
                    startDate: DateTime.local(),
                    endDate: DateTime.local().endOf('day'),
                });
            },
        };
        actionServiceStub = {
            getDeviceType() {
                return DeviceType.Desktop;
            },
            deviceType() {
                return this.deviceTypeSubject.asObservable();
            },
            deviceTypeSubject: new BehaviorSubject(DeviceType.Desktop),
        };

        TestBed.configureTestingModule({
            declarations: [
                InternalMailsComponent,
                TableComponent,
                WrapperComponent,
                DatepickerComponent,
                LoaderComponent,
            ],
            providers: [
                {provide: InternalMailsService, useValue: internalMailsServiceStub},
                {provide: ConfigService, useValue: configServiceStub},
                {provide: ActionService, useValue: actionServiceStub},
                {provide: HistoryFilterService, useValue: historyFilterServiceStub},
                {provide: 'injectParams', useValue: injectParams},
            ],
        });

        configGetSpy = spyOn(TestBed.inject(ConfigService), 'get');
        configGetSpy.and.returnValue(isProfileFirst ? 'first' : 'default');

        fixture = TestBed.createComponent(InternalMailsComponent);
        nativeElement = fixture.nativeElement;
        component = fixture.componentInstance;

        fixture.detectChanges();
    };

    it('should create', (): void => {
        setup();
        expect(component).toBeDefined();
    });

    it('-> check tableData.switchWidth in first profile', fakeAsync((): void => {
        setup(true);
        internalMailsServiceStub.mailsReady.resolve();
        flushMicrotasks();

        expect(component.tableData.switchWidth).toBe(1200);
    }));

    it('-> check tableData.switchWidth in default profile', fakeAsync((): void => {
        setup();
        internalMailsServiceStub.mailsReady.resolve();
        flushMicrotasks();

        expect(component.tableData.switchWidth).toBe(1024);
    }));

    it('-> check loader at start', (): void => {
        setup();
        expect(nativeElement.querySelector('[wlc-loader]')).toEqual(jasmine.anything());
        expect(nativeElement.querySelector(`${defaultParams.class}__empty`)).not.toEqual(jasmine.anything());
        expect(nativeElement.querySelector('[wlc-table]')).not.toEqual(jasmine.anything());
    });

    it('-> check empty block after mailsReady with mails$.langth === 0', fakeAsync((): void => {
        setup();
        internalMailsServiceStub.mailsReady.resolve();
        flushMicrotasks();
        internalMailsServiceStub.mails$.next([]);
        flushMicrotasks();

        expect(nativeElement.querySelector('[wlc-loader]')).not.toEqual(jasmine.anything());
        expect(nativeElement.querySelector(`.${defaultParams.class}__empty`)).toEqual(jasmine.anything());
        expect(nativeElement.querySelector('[wlc-table]')).not.toEqual(jasmine.anything());
    }));

    it('-> check wlc-table after mailsReady with mails$.langth !== 0', fakeAsync((): void => {
        setup();
        internalMailsServiceStub.mailsReady.resolve();
        flushMicrotasks();
        internalMailsServiceStub.mails$.next(['mail-1', 'mail-2']);
        flushMicrotasks();

        expect(nativeElement.querySelector('[wlc-loader]')).not.toEqual(jasmine.anything());
        expect(nativeElement.querySelector(`${defaultParams.class}__empty`)).not.toEqual(jasmine.anything());
        expect(nativeElement.querySelector('[wlc-table]')).toEqual(jasmine.anything());
    }));

    it('-> check 2 wlc-datepickers on desktop', fakeAsync((): void => {
        setup();
        internalMailsServiceStub.mailsReady.resolve();
        flushMicrotasks();
        internalMailsServiceStub.mails$.next([]);
        flushMicrotasks();

        expect(nativeElement.querySelectorAll('[wlc-datepicker]').length).toBe(2);
    }));

    it('-> make sure there is no wlc-datepickers after changing DeviceType', fakeAsync((): void => {
        setup();
        internalMailsServiceStub.mailsReady.resolve();
        flushMicrotasks();
        internalMailsServiceStub.mails$.next([]);
        flushMicrotasks();

        actionServiceStub.deviceTypeSubject.next(DeviceType.Mobile);
        flushMicrotasks();

        expect(nativeElement.querySelectorAll('[wlc-datepicker]').length).toBe(0);
    }));
});

@Component({selector: '[wlc-table]'})
class TableComponent {
    @Input() inlineParams;
}

@Component({selector: '[wlc-wrapper]'})
class WrapperComponent {
    @Input() inlineParams;
}

@Component({selector: '[wlc-datepicker]'})
class DatepickerComponent {
    @Input() inlineParams;
}
@Component({selector: '[wlc-loader]'})
class LoaderComponent {}
