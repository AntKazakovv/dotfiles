import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {IconMerchantsListComponent} from './icon-merchants-list.component';
import {defaultParams, IIconMerchantsListCParams} from './icon-merchants-list.params';
import {ConfigService, InjectionService} from 'wlc-engine/modules/core';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services';
import {MerchantModel} from 'wlc-engine/modules/games';

describe('IconMerchantsListComponent', () => {
    let component: IconMerchantsListComponent;
    let fixture: ComponentFixture<IconMerchantsListComponent>;
    let ConfigServiceSpy: jasmine.SpyObj<ConfigService>;
    let InjectionServiceSpy: jasmine.SpyObj<InjectionService>;
    let GamesCatalogServiceSpy: jasmine.SpyObj<GamesCatalogService>;
    let nativeElement: HTMLElement;

    const injectParams: IIconMerchantsListCParams = {
        wlcElement: 'wlc-icon-merchants-list',
        theme: 'default',
        themeMod: 'default',
        iconComponentParams: {
            theme: 'merchants',
            type: 'svg',
            wlcElement: 'block_merchants',
            hideImgOnError: true,
        },
    };

    const merchantsConfig: MerchantModel[] = [
        new MerchantModel({}, {
            'ID': '987',
            'Name': 'TomHorn',
            'IDParent': null,
            'Alias': 'TomHorn',
            'Image': '/gstatic/merchants/tomhorn.jpg',
            'menuId': 'tomhorn',
        }),
        new MerchantModel({}, {
            'ID': '978',
            'Name': 'PariPlay',
            'IDParent': null,
            'Alias': 'PariPlay',
            'Image': '/gstatic/merchants/pariplay.jpg',
            'menuId': 'pariplay',
        }),
    ];

    beforeEach(() => {
        ConfigServiceSpy = jasmine.createSpyObj('ConfigService', ['load', 'get', 'set'], {
            'ready': Promise.resolve(),
        });
        GamesCatalogServiceSpy = jasmine.createSpyObj('GamesCatalogService', [], {
            'ready': Promise.resolve(),
            'getAvailableMerchants': () => merchantsConfig,
        });
        InjectionServiceSpy = jasmine.createSpyObj(
            'InjectionService',
            ['getComponent', 'loadComponent', 'importModules'],
            {
                'getService': async () => GamesCatalogServiceSpy,
            },
        );

        TestBed.configureTestingModule({
            imports: [AppModule],
            declarations: [IconMerchantsListComponent],
            providers: [
                {
                    provide: ConfigService,
                    useValue: ConfigServiceSpy,
                },
                {
                    provide: InjectionService,
                    useValue: InjectionServiceSpy,
                },
            ],
        }).overrideComponent(IconMerchantsListComponent, {
            set: {
                providers: [
                    {
                        provide: 'injectParams',
                        useValue: injectParams,
                    },
                ],
            },
        }).compileComponents();

        fixture = TestBed.createComponent(IconMerchantsListComponent);
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
        const classes = nativeElement.classList;

        expect(classes.contains(`${defaultParams.class}--theme-${injectParams.theme}`)).toBeTrue();
        expect(classes.contains(`${defaultParams.class}--theme-mod-${injectParams.themeMod}`)).toBeTrue();
        expect(classes.contains(`${defaultParams.class}--type-default`)).toBeTrue();
    });

    // TODO ticket #262281
});
