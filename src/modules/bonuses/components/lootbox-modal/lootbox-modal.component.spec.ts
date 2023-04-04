import {
    ComponentFixture,
    fakeAsync,
    flushMicrotasks,
    TestBed,
} from '@angular/core/testing';
import {
    MockComponent,
    MockPipe,
    MockService,
} from 'ng-mocks';
import {TranslatePipe} from '@ngx-translate/core';

import {SwiperComponent} from 'swiper/angular';
import _trim from 'lodash-es/trim';
import _assign from 'lodash-es/assign';

import {
    ConfigService,
    EventService,
    ModalService,
} from 'wlc-engine/modules/core';
import {ButtonComponent} from 'wlc-engine/modules/core/components/button/button.component';
import {SliderComponent} from 'wlc-engine/modules/promo';
import {IBonus} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';
import {LootboxPrizeModel} from 'wlc-engine/modules/bonuses/system/models/lootbox-prize/lootbox-prize.model';
import {LootboxModalComponent} from './lootbox-modal.component';
import {
    ILootboxModalCParams,
    defaultParams,
} from './lootbox-modal.params';

describe('LootboxModalComponent', (): void => {
    const getBonus = (fields?: Partial<Bonus>): jasmine.SpyObj<Bonus> => {
        return jasmine.createSpyObj<Bonus>('bonus', [], _assign({
            'id': 0,
            'viewTarget': 'relative',
            'value': [1, 2, 3],
            'name': 'Simple bonus',
            'description': 'Simple bonus for you',
            'terms': 'Simple test',
            'canSubscribe': false,
            'inventoried': false,
            'canUnsubscribe': false,
            'isActive': false,
            'isDeposit': false,
        }, fields));
    };

    const getPrize = (fields?: Partial<LootboxPrizeModel>): jasmine.SpyObj<LootboxPrizeModel> => {
        return jasmine.createSpyObj<LootboxPrizeModel>('prize', [], _assign({
            id: 0,
            name: 'Simple prize',
            description: 'Simple prize description',
            terms: 'Simple prize terms',
        }, fields));
    };

    const injectParams: Partial<ILootboxModalCParams> = {
        theme: 'default',
        themeMod: 'default',
        type: 'default',
        wlcElement: 'wlc-lootbox-modal',
        bonus: getBonus(),
    };
    let component: LootboxModalComponent;
    let fixture: ComponentFixture<LootboxModalComponent>;
    let nativeElement: HTMLElement;
    let BonusesServiceSpy: jasmine.SpyObj<BonusesService>;

    beforeEach((): void => {
        BonusesServiceSpy = jasmine.createSpyObj(
            'BonusesService',
            ['takeInventory', 'getLootboxPrizes'],
        );
        TestBed.configureTestingModule({
            declarations: [
                LootboxModalComponent,
                MockComponent(SliderComponent),
                MockComponent(SwiperComponent),
                MockComponent(ButtonComponent),
                MockPipe(TranslatePipe, (val) => val),
            ],
            providers: [
                {
                    provide: 'injectParams',
                    useValue: injectParams,
                },
                {
                    provide: BonusesService,
                    useValue: BonusesServiceSpy,
                },
                {
                    provide: ConfigService,
                    useValue: MockService(ConfigService),
                },
                {
                    provide: EventService,
                    useValue: MockService(EventService),
                },
                {
                    provide: ModalService,
                    useValue: MockService(ModalService),
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LootboxModalComponent);
        component = fixture.componentInstance;
        nativeElement = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('-> should be created', (): void => {
        expect(component).toBeTruthy();
    });

    it('-> checking for the presence of an attribute', (): void => {
        expect(nativeElement.getAttribute('data-wlc-element')).toEqual(injectParams.wlcElement);
    });

    it('-> checking for the presence of an class', (): void => {
        const classes = nativeElement.getAttribute('class');

        expect(classes.includes(`${defaultParams.class}--theme-${injectParams.theme}`)).toBeTrue();
        expect(classes.includes(`${defaultParams.class}--theme-mod-${injectParams.themeMod}`)).toBeTrue();
        expect(classes.includes(`${defaultParams.class}--type-${injectParams.type}`)).toBeTrue();
    });

    it('-> Check component without bonuses', async (): Promise<void> => {
        BonusesServiceSpy.getLootboxPrizes.withArgs(injectParams.bonus).
            and.returnValues(Promise.resolve(
                [],
            ));

        await component.ngOnInit();

        expect(component.lootboxStatus).toEqual('error');
        expect(_trim(nativeElement.querySelector(`.${defaultParams.class}__desc`).textContent))
            .toEqual('Failed to claim, please try again later');
        expect(component.btnText).toBe('Spin');
        expect(component.btnDisabled).toBeFalse();
        expect(component.btnThemeMod).toBe('default');
        expect(nativeElement.querySelectorAll(`.${defaultParams.class}__buttons button`).length).toBe(2);
    });

    it('-> Check component with "open" status', fakeAsync((): void => {
        BonusesServiceSpy.getLootboxPrizes.withArgs(injectParams.bonus).
            and.returnValues(Promise.resolve(
                [
                    getPrize({id: 100}),
                    getPrize({id: 200}),
                    getPrize({id: 300}),
                ],
            ));

        component.ngOnInit();
        flushMicrotasks();

        expect(component.title).toEqual('Lootbox');
        expect(_trim(nativeElement.querySelector(`.${defaultParams.class}__desc`).textContent))
            .toEqual('Press the "Spin" button to randomly select one of the bonuses');
        expect(component.slides.length).toBe(defaultParams.totalSlides);
        expect(component.btnText).toBe('Spin');
        expect(component.btnDisabled).toBeFalse();
        expect(component.btnThemeMod).toBe('default');
        expect(nativeElement.querySelectorAll(`.${defaultParams.class}__buttons button`).length).toBe(1);
    }));

    it('-> Check method "btnClick" and "onSlideChangeTransitionEnd"', async (): Promise<void> => {
        BonusesServiceSpy.getLootboxPrizes.withArgs(injectParams.bonus).
            and.returnValues(Promise.resolve(
                [
                    getPrize({id: 100}),
                    getPrize({id: 200}),
                    getPrize({id: 300}),
                ],
            ));

        BonusesServiceSpy.takeInventory.withArgs(
            injectParams.bonus,
            defaultParams.sliderParams.swiper.speed,
        ).and.returnValues(Promise.resolve(
            getBonus({
                id: 1,
                bonus: <IBonus>{
                    ID: '100',
                },
            }),
        ));

        await component.ngOnInit();
        await component.btnClick();
        component.onSlideChangeTransitionEnd();

        expect(component.title).toEqual('Congratulations!');
        expect(component.lootboxStatus).toEqual('dropped');
        expect(_trim(nativeElement.querySelector(`.${defaultParams.class}__desc`).textContent))
            .toEqual(`Bonus "${getPrize().name}" has been successfully activated and added to your bonus list`);
        expect(component.slides.length).toBe(defaultParams.totalSlides + 3);
        expect(nativeElement.querySelectorAll(`.${defaultParams.class}__buttons button`).length).toBe(1);
        expect(component.btnDisabled).toBeFalse();
        expect(component.btnThemeMod).toBe('secondary');
    });

    it('-> Check method "btnClick" on error', async (): Promise<void> => {
        BonusesServiceSpy.takeInventory.withArgs(
            injectParams.bonus,
            defaultParams.sliderParams.swiper.speed,
        ).and.returnValues(undefined);

        await component.btnClick();

        expect(component.title).toEqual('Lootbox');
        expect(component.lootboxStatus).toEqual('error');
        expect(_trim(nativeElement.querySelector(`.${defaultParams.class}__desc`).textContent))
            .toEqual('Failed to claim, please try again later');
        expect(component.btnDisabled).toBeFalse();
        expect(nativeElement.querySelectorAll(`.${defaultParams.class}__buttons button`).length).toBe(2);
    });
});
