import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import {BehaviorSubject} from 'rxjs';

import {IconMerchantsListComponent} from './icon-merchants-list.component';
import {IIconMerchantsListCParams} from './icon-merchants-list.params';
import {
    ConfigService,
    ColorThemeService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {
    MerchantModel,
    GamesCatalogService,
} from 'wlc-engine/modules/games';

describe('IconMerchantsListComponent', () => {
    let component: IconMerchantsListComponent;
    let fixture: ComponentFixture<IconMerchantsListComponent>;
    let ConfigServiceSpy: jasmine.SpyObj<ConfigService>;
    let InjectionServiceSpy: jasmine.SpyObj<InjectionService>;
    let GamesCatalogServiceSpy: jasmine.SpyObj<GamesCatalogService>;
    let colorThemeServiceSpy: jasmine.SpyObj<ColorThemeService>;
    let availableMerchants: MerchantModel[];

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
        new MerchantModel({}, {
            'ID': '979',
            'Name': 'Amatic',
            'IDParent': null,
            'Alias': 'Amatic',
            'Image': '/gstatic/merchants/amatic.jpg',
            'menuId': 'amatic',
        }),
        new MerchantModel({}, {
            'ID': '980',
            'Name': 'Ezugi',
            'IDParent': null,
            'Alias': 'Ezugi',
            'Image': '/gstatic/merchants/ezugi.jpg',
            'menuId': 'ezugi',
        }),
        new MerchantModel({}, {
            'ID': '981',
            'Name': 'BetSoft',
            'IDParent': null,
            'Alias': 'BetSoft',
            'Image': '/gstatic/merchants/betsoft.jpg',
            'menuId': 'betsoft',
        }),
    ];

    beforeEach(() => {
        ConfigServiceSpy = jasmine.createSpyObj('ConfigService', ['load', 'get', 'set'], {
            'ready': Promise.resolve(),
        });

        GamesCatalogServiceSpy = jasmine.createSpyObj('GamesCatalogService', [], {
            'ready': Promise.resolve(),
            'getAvailableMerchants': () => merchantsConfig,
            'getMerchantByName': (name: string): MerchantModel => new MerchantModel({}, {
                'ID': `id-${name}`,
                'Name': name,
                'IDParent': null,
                'Alias': name,
                'Image': `/gstatic/merchants/${name.toLocaleLowerCase()}.jpg`,
                'menuId': name.toLocaleLowerCase(),
            }),
        });

        InjectionServiceSpy = jasmine.createSpyObj(
            'InjectionService',
            [
                'getComponent',
                'loadComponent',
                'importModules',
            ],
            {
                'getService': async () => GamesCatalogServiceSpy,
            },
        );
        colorThemeServiceSpy = jasmine.createSpyObj(
            'ColorThemeService',
            [],
            {'appColorTheme$': new BehaviorSubject(null)});

        TestBed.configureTestingModule({
            declarations: [IconMerchantsListComponent],
            providers: [
                {
                    provide: ConfigService,
                    useValue: ConfigServiceSpy,
                },
                {
                    provide: ColorThemeService,
                    useValue: colorThemeServiceSpy,
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
        availableMerchants = GamesCatalogServiceSpy.getAvailableMerchants();

        component.ngOnInit();

        fixture.detectChanges();
    });

    it('-> empty `include` list should not depend to merchants list length', () => {
        component.$params.include = [];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(component.items.length).toBe(availableMerchants.length);
        });
    });

    it('-> length should be increased by unique merchants', () => {
        const existingIcons = ['tomhorn', 'pariplay'];
        const uniqueIcons = ['NonExisting', 'Unique'];

        component.$params.include = [...existingIcons, ...uniqueIcons];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const totalIconsCount = availableMerchants.length + uniqueIcons.length;
            expect(component.items.length).toBe(totalIconsCount);
        });
    });

    it('-> should not constraint if there are no exclusions', () => {
        component.$params.exclude = [];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(component.items.length).toBe(availableMerchants.length);
        });
    });

    it('-> should keep the icons list empty if `exclude` equals "all"', () => {
        component.$params.exclude = ['all'];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(component.items.length).toBe(0);
        });
    });

    it('-> showing icons as svg', () => {
        component.$params.iconsType = 'black';

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const isShowAsSvg = component.items.every((comp) => comp.showAs === 'svg');
            expect(isShowAsSvg).toBe(true);
        });
    });

    it('-> showing icons as image', () => {
        component.$params.iconsType = 'color';

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const isShowAsImage = component.items.every((comp) => comp.showAs === 'img');
            expect(isShowAsImage).toBe(true);
        });
    });

    it('-> setting `alt` property from merchant ', () => {
        component['merchants'] = [...merchantsConfig];

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const isAltFromMerchant = component.items.every((comp, idx) => {
                return comp.alt === component['merchants'][idx].alias;
            });

            expect(isAltFromMerchant).toEqual(true);
        });
    });

    it('-> setting `wlcElement` property from merchant ', () => {
        component['merchants'] = [...merchantsConfig];

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const isWlcElementFromMerchant = component.items.every((comp, idx) => {
                return comp.wlcElement === component['merchants'][idx].wlcElement;
            });

            expect(isWlcElementFromMerchant).toEqual(true);
        });
    });
});
