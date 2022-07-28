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

import {BehaviorSubject} from 'rxjs';

import {
    ConfigService,
    Deferred,
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

describe('OpenMailBtnComponent', (): void => {
    let component: InternalMailsComponent;
    let fixture: ComponentFixture<InternalMailsComponent>;
    let nativeElement: HTMLElement;
    let injectParams: Params.IInternalMailsCParams;
    let defaultParams: Params.IInternalMailsCParams = Params.defaultParams;

    let internalMailsServiceStub: IInternalMailsServiceStub;
    let configServiceStub: IConfigServiceStub;

    let configGetSpy: jasmine.Spy;

    const setup = (isProfileFirst: boolean = false): void => {
        injectParams = {
            theme: 'default',
            themeMod: 'default',
            type: 'default',
            wlcElement: 'wlc-internal-mails',
        };

        internalMailsServiceStub = {
            mailsReady: new Deferred(),
            mails$: new BehaviorSubject([]),
        };
        configServiceStub = {
            get() {
                return {};
            },
        };

        TestBed.configureTestingModule({
            declarations: [
                InternalMailsComponent,
                TableComponent,
                WrapperComponent,
            ],
            providers: [
                {provide: InternalMailsService, useValue: internalMailsServiceStub},
                {provide: ConfigService, useValue: configServiceStub},
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

    it('-> check tableData.switchWidth in first profile', (): void => {
        setup(true);
        expect(component.tableData.switchWidth).toBe(1200);
    });

    it('-> check tableData.switchWidth in default profile', (): void => {
        setup();
        expect(component.tableData.switchWidth).toBe(1024);
    });

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

        expect(nativeElement.querySelector('[wlc-loader]')).not.toEqual(jasmine.anything());
        expect(nativeElement.querySelector(`.${defaultParams.class}__empty`)).toEqual(jasmine.anything());
        expect(nativeElement.querySelector('[wlc-table]')).not.toEqual(jasmine.anything());
    }));

    it('-> check wlc-table after mailsReady with mails$.langth !== 0', fakeAsync((): void => {
        setup();
        internalMailsServiceStub.mailsReady.resolve();
        internalMailsServiceStub.mails$.next(['mail-1', 'mail-2']);
        flushMicrotasks();

        expect(nativeElement.querySelector('[wlc-loader]')).not.toEqual(jasmine.anything());
        expect(nativeElement.querySelector(`${defaultParams.class}__empty`)).not.toEqual(jasmine.anything());
        expect(nativeElement.querySelector('[wlc-table]')).toEqual(jasmine.anything());
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
