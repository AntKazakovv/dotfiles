import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {
    StateService,
    UIRouter,
} from '@uirouter/core';

import {Observable} from 'rxjs';

import {
    ActionService,
    ConfigService,
    DeviceType,
    EventService,
    ModalService,
} from 'wlc-engine/modules/core';
import {MenuComponent} from './menu.component';
import {
    defaultParams,
    IMenuCParams,
} from './menu.params';

describe('MenuComponent', () => {
    let component: MenuComponent;
    let fixture: ComponentFixture<MenuComponent>;

    let configServiceSpy: jasmine.SpyObj<ConfigService>;
    let actionServiceSpy: jasmine.SpyObj<ActionService>;
    let modalServiceSpy: jasmine.SpyObj<ModalService>;
    let eventServiceSpy: jasmine.SpyObj<EventService>;
    let stateServiceSpy: jasmine.SpyObj<StateService>;
    let translateServiceSpy: jasmine.SpyObj<TranslateService>;
    let routerSpy: jasmine.SpyObj<UIRouter>;

    function createComponent(injectParams: IMenuCParams): void {
        TestBed.overrideProvider(
            'injectParams', {
                useValue: injectParams,
            });

        fixture = TestBed.createComponent(MenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    beforeEach(() => {
        actionServiceSpy = jasmine.createSpyObj(
            'ActionService',
            ['getDeviceType', 'deviceType'],
            {
                device: {
                    osName: 'ios',
                    browserName: 'safari',
                },
            },
        );
        actionServiceSpy.deviceType.and.returnValue(new Observable<DeviceType>(() => {}));
        configServiceSpy = jasmine.createSpyObj('ConfigService', ['get']);
        eventServiceSpy = jasmine.createSpyObj('EventService', ['subscribe', 'filter']);
        eventServiceSpy.filter.and.returnValue(new Observable(() => {}));

        TestBed.configureTestingModule({
            declarations: [MenuComponent],
            providers: [
                {
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
                {
                    provide: ActionService,
                    useValue: actionServiceSpy,
                },
                {
                    provide: ModalService,
                    useValue: modalServiceSpy,
                },
                {
                    provide: EventService,
                    useValue: eventServiceSpy,
                },
                {
                    provide: StateService,
                    useValue: stateServiceSpy,
                },
                {
                    provide: TranslateService,
                    useValue: translateServiceSpy,
                },
                {
                    provide: UIRouter,
                    useValue: routerSpy,
                },
            ],
        }).compileComponents();
    });

    it('-> should be created', () => {
        createComponent(defaultParams);
        expect(component).toBeTruthy();
    });

    it('-> setExtension: check set fallback with png extension', () => {
        createComponent({
            moduleName: 'menu',
            componentName: 'wlc-menu',
            theme: 'default',
            common: {
                icons: {
                    extension: 'png',
                    fallback: 'plug',
                },
            },
        });
        expect(component.iconsFallback).toEqual('plug.png');
    });
});
