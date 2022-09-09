import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';

import _concat from 'lodash-es/concat';
import _random from 'lodash-es/random';
import _find from 'lodash-es/find';
import _toNumber from 'lodash-es/toNumber';
import _isObject from 'lodash-es/isObject';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    ModalService,
    EventService,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {
    ISlide,
    SliderComponent,
} from 'wlc-engine/modules/promo';
import {ThemeMod as BtnThemeMod} from 'wlc-engine/modules/core/components/button/button.params';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';
import {LootboxPrizeModel} from 'wlc-engine/modules/bonuses/system/models/lootbox-prize/lootbox-prize.model';
import {LootboxPrizeComponent} from 'wlc-engine/modules/bonuses/components/lootbox-prize/lootbox-prize.component';

import * as Params from './lootbox-modal.params';

type TLootboxStatus = 'open' | 'spin' | 'dropped' | 'error';

@Component({
    selector: '[wlc-lootbox-modal]',
    templateUrl: './lootbox-modal.component.html',
    styleUrls: ['./styles/lootbox-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LootboxModalComponent extends AbstractComponent implements OnInit {
    @ViewChild(SliderComponent) protected slider: SliderComponent;

    public slidesReady: boolean = false;
    public $params: Params.ILootboxModalCParams;
    public slides: ISlide[] = [];
    public title: string = gettext('Lootbox');
    public lootboxStatus: TLootboxStatus = 'open';
    public btnDisabled: boolean = false;
    public btnText: string = gettext('Spin');
    public btnThemeMod: BtnThemeMod = 'default';
    public droppedPrize: LootboxPrizeModel;
    protected prizes: LootboxPrizeModel[] = [];

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILootboxModalCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected bonusesService: BonusesService,
        protected modalService: ModalService,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.ILootboxModalCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.prizes = await this.bonusesService.getLootboxPrizes(this.$params.bonus);

        if (!this.prizes.length) {
            this.lootboxStatus = 'error';
            this.clearModifiers();
            this.addModifiers(this.lootboxStatus);

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Bonus error'),
                    message: gettext('No available bonuses'),
                    wlcElement: 'notification_bonus-error',
                },
            });

            this.slidesReady = true;
            this.cdr.detectChanges();
            return;
        }

        let lastPrize: LootboxPrizeModel;
        for (let i = 0; i < this.$params.totalSlides; i++) {
            this.slides.push(
                this.getSlide(this.prizes.length > 1 ?
                    lastPrize = this.getRandomPrize(lastPrize?.id) : this.prizes[0]),
            );
        }

        this.slidesReady = true;
        this.addModifiers(this.lootboxStatus);
    }

    /**
     * Fires after clicking on the button at the bottom of the modal
     *
     * @returns {Promise<void>}
     */
    public async btnClick(): Promise<void> {
        if (this.droppedPrize) {
            this.close();
            return;
        }

        this.lootboxStatus = 'spin';
        this.btnDisabled = true;

        try {
            const {bonus}: Bonus = await this.getDroppedBonus();

            this.droppedPrize = _find(
                this.prizes,
                {id: _isObject(bonus) ? _toNumber(bonus.ID) : bonus},
            );

            this.slides = _concat(
                this.slides,
                this.getSlide(this.droppedPrize),
                this.slides[_random(this.$params.totalSlides - 1)],
                this.slides[_random(this.$params.totalSlides - 1)],
            );
            this.clearModifiers();
            this.addModifiers(this.lootboxStatus);
            this.cdr.detectChanges();

            this.slider.swiper.swiperRef.enable();
            this.slider.swiper.swiperRef.slideTo(this.$params.totalSlides);
            this.slider.swiper.swiperRef.disable();
        } catch (error) {
            this.lootboxStatus = 'error';
            this.btnDisabled = false;
            this.clearModifiers();
            this.addModifiers(this.lootboxStatus);
            this.cdr.detectChanges();
        }
    }

    /**
     * Close modal
     *
     * @returns {void}
     */
    public close(): void {
        this.modalService.hideModal('lootbox');
    }

    /**
     * Fires when the transition to the active slide ends
     *
     * @returns {void}
     */
    public onSlideChangeTransitionEnd(): void {
        this.lootboxStatus = 'dropped';
        this.title = gettext('Congratulations!');
        this.btnDisabled = false;
        this.btnThemeMod = 'secondary';
        this.btnText = gettext('Close');
        this.clearModifiers();
        this.addModifiers(this.lootboxStatus);
        this.cdr.detectChanges();
    }

    protected async getDroppedBonus(): Promise<Bonus> {
        return await this.bonusesService.takeInventory(
            this.$params.bonus,
            this.$params.sliderParams.swiper.speed,
        );
    }

    protected getRandomPrize(lastPrizeId?: number): LootboxPrizeModel {
        const prize: LootboxPrizeModel = this.prizes[_random(this.prizes.length - 1)];
        return prize.id === lastPrizeId ? this.getRandomPrize(lastPrizeId) : prize;
    }

    protected getSlide(prize: LootboxPrizeModel): ISlide {
        return {
            component: LootboxPrizeComponent,
            componentParams: {
                prize: prize,
                wlcElement: 'block_lootbox-prize',
            },
        };
    }
}
