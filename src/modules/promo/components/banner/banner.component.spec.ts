import {
    ComponentFixture,
    fakeAsync,
    flushMicrotasks,
    TestBed,
} from '@angular/core/testing';
import {MockService} from 'ng-mocks';

import _set from 'lodash-es/set';

import {Deferred} from 'wlc-engine/modules/core';
import {
    ConfigService,
    LogService,
} from 'wlc-engine/modules/core';
import {
    BannerModel,
    BannersService,
} from 'wlc-engine/modules/promo';
import {BannerComponent} from './banner.component';
import {defaultParams} from './banner.params';

describe('BannerComponent', () => {
    let component: BannerComponent;
    let fixture: ComponentFixture<BannerComponent>;
    let nativeElement: HTMLElement;
    let BannersServiceSpy: jasmine.SpyObj<BannersService>;
    let bannersServiceReadyStatus: Deferred<void> = new Deferred<void>();
    bannersServiceReadyStatus.resolve();

    const injectParams = {
        wlcElement: 'test-wlc-element',
        theme: 'default-banner',
    };

    const testBanner: BannerModel = new BannerModel({
        service: 'BannersService',
        method: 'prepareBanners',
    }, {
        html: '<span>test</span>',
        platform: ['any'],
        tags: ['home'],
        visibility: [],
    });

    beforeEach(() => {
        BannersServiceSpy = jasmine.createSpyObj('BannersService',
            {
                getBanners: [testBanner],
            },
            {
                readyStatus: bannersServiceReadyStatus,
            },
        );

        TestBed.configureTestingModule({
            declarations: [BannerComponent],
            providers: [
                {
                    provide: 'injectParams',
                    useValue: injectParams,
                },
                {
                    provide: BannersService,
                    useValue: BannersServiceSpy,
                },
                {
                    provide: ConfigService,
                    useValue: MockService(ConfigService),
                },
                {
                    provide: LogService,
                    useValue: MockService(LogService),
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BannerComponent);
        component = fixture.componentInstance;
        nativeElement = fixture.nativeElement;

        fixture.detectChanges();
    });

    it('-> should be created', () => {
        expect(component).toBeTruthy();
    });

    it('-> checking for the presence of an attribute', () => {
        expect(nativeElement.getAttribute('data-wlc-element')).toEqual(injectParams.wlcElement);
    });

    it('-> checking for the presence of an class', () => {
        expect(nativeElement.classList.contains(`${defaultParams.class}--theme-${injectParams.theme}`)).toBeTrue();
        expect(nativeElement.classList.contains(`${defaultParams.class}--theme-mod-default`)).toBeTrue();
        expect(nativeElement.classList.contains(`${defaultParams.class}--type-default`)).toBeTrue();
    });

    it('-> getBanner: getting a banner by filter', fakeAsync(() => {
        _set(component, 'inlineParams.filter.position', ['any']);
        fixture.detectChanges();
        component.ngOnInit();
        flushMicrotasks();
        expect(component.$params.banner).toEqual(testBanner);
    }));
});
