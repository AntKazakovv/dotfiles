import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    ViewChild,
    AfterViewInit,
} from '@angular/core';

import _concat from 'lodash-es/concat';
import _random from 'lodash-es/random';
import _filter from 'lodash-es/filter';
import _includes from 'lodash-es/includes';
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
    ProfileType,
} from 'wlc-engine/modules/core';
import {
    ISlide,
    SliderComponent,
} from 'wlc-engine/modules/promo';
import {ThemeMod as BtnThemeMod} from 'wlc-engine/modules/core/components/button/button.params';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';
import {BonusItemComponent} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.component';

import * as Params from './lootbox-modal.params';

type TLootboxStatus = 'open' | 'spin' | 'dropped' | 'error';

@Component({
    selector: '[wlc-lootbox-modal]',
    templateUrl: './lootbox-modal.component.html',
    styleUrls: ['./styles/lootbox-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LootboxModalComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @ViewChild(SliderComponent) protected slider: SliderComponent;

    public $params: Params.ILootboxModalCParams;
    public slides: ISlide[] = [];
    public title: string = gettext('Lootbox');
    public lootboxStatus: TLootboxStatus = 'open';
    public btnDisabled: boolean = false;
    public btnText: string = gettext('Spin');
    public btnThemeMod: BtnThemeMod = 'default';
    public droppedBonus: Bonus;
    protected bonuses: Bonus[] = [];
    protected themeMod: ProfileType = 'default';

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

    public ngOnInit(): void {
        super.ngOnInit();

        this.bonuses = _filter(this.bonusesService.bonuses,
            (bonus: Bonus): boolean => _includes(<number[]>this.$params.bonus.value, bonus.id));

        if (!this.bonuses.length) {
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

            this.cdr.detectChanges();
            return;
        }

        this.themeMod = this.configService.get<ProfileType>('$base.profile.type');
        let lastBonus: Bonus;
        for (let i = 0; i < this.$params.initialSlides; i++) {
            this.slides.push(
                this.getSlide(this.bonuses.length > 1 ?
                    lastBonus = this.getRandomBonus(lastBonus?.id) : this.bonuses[0], false),
            );
        }

        this.addModifiers(this.lootboxStatus);
    }

    public ngAfterViewInit(): void {
        if (this.bonuses.length) {
            const slides: ISlide[] = [];
            for (let i = 0; i < this.$params.totalSlides - this.$params.initialSlides; i++) {
                slides.push(
                    this.getSlide(this.getRandomBonus(), false),
                );
            }
            this.slides = _concat(this.slides, slides);
            this.cdr.detectChanges();
        }
    }

    /**
     * Fires after clicking on the button at the bottom of the modal
     *
     * @returns {Promise<void>}
     */
    public async btnClick(): Promise<void> {
        if (this.droppedBonus) {
            this.close();
            return;
        }

        this.lootboxStatus = 'spin';
        this.btnDisabled = true;

        try {
            const {bonus}: Bonus = await this.getDroppedBonus();

            this.droppedBonus = _find(
                this.bonuses,
                {id: _isObject(bonus) ? _toNumber(bonus.ID) : bonus},
            );

            this.slides = _concat(
                this.slides,
                this.getSlide(this.droppedBonus, true),
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

    protected getRandomBonus(lastBonusId?: number): Bonus {
        const bonus: Bonus = this.bonuses[_random(this.bonuses.length - 1)];
        return bonus.id === lastBonusId ? this.getRandomBonus(lastBonusId) : bonus;
    }

    protected getSlide(bonus: Bonus, iconMoreBtn: boolean): ISlide {
        return {
            component: BonusItemComponent,
            componentParams: {
                theme: 'lootbox',
                themeMod: this.configService.get<string>('$base.profile.type'),
                bonus,
                wlcElement: 'block_bonus',
                common: {
                    iconMoreBtn,
                },
            },
        };
    }
}
