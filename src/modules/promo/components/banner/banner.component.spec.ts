import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {BannerComponent} from './banner.component';
import {defaultParams} from './banner.params';
import {BannerModel, BannersService} from 'wlc-engine/modules/promo';

import _set from 'lodash-es/set';

describe('ButtonComponent', () => {
    let component: BannerComponent;
    let fixture: ComponentFixture<BannerComponent>;
    let nativeElement: HTMLElement;
    let BannersServiceSpy: jasmine.SpyObj<BannersService>;

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
        BannersServiceSpy = jasmine.createSpyObj('BannersService', {
            getBanners: [testBanner],
        });

        TestBed.configureTestingModule({
            imports: [AppModule],
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
        const classes = nativeElement.getAttribute('class');

        expect(classes.includes(`${defaultParams.class}--theme-${injectParams.theme}`)).toBeTrue();
        expect(classes.includes(`${defaultParams.class}--theme-mod-default`)).toBeTrue();
        expect(classes.includes(`${defaultParams.class}--type-default`)).toBeTrue();
    });

    it('-> getBanner: getting a banner by filter', () => {
        _set(component, 'inlineParams.filter.position', ['any']);
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.$params.banner).toEqual(testBanner);
    });
});
