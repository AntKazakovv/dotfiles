import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    ChangeDetectorRef,
    ViewChild,
    TemplateRef,
} from '@angular/core';

import Swiper from 'swiper';
import {takeUntil} from 'rxjs/operators';
import _merge from 'lodash-es/merge';
import _isObject from 'lodash-es/isObject';

import {
    AbstractComponent,
    ConfigService,
    DeviceModel,
    EventService,
    GlobalHelper,
    ISlide,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    IAutoSelectByDevice,
    PaymentSystem,
} from 'wlc-engine/modules/finances';
import {
    Bonus,
    disabledReasons,
} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services';
import {
    BonusItemComponentEvents,
    IBonus,
    IPromoCodeInfo,
} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';
import {BonusItemComponent} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.component';
import {IBonusItemCParams} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.params';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './deposit-bonuses.params';

@Component({
    selector: '[wlc-deposit-bonuses]',
    templateUrl: './deposit-bonuses.component.html',
    styleUrls: ['./styles/deposit-bonuses.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositBonusesComponent extends AbstractComponent implements OnInit {
    @ViewChild('bonusesList') protected list: TemplateRef<any>;

    public override $params: Params.IDepositBonusesCParams;
    public bonuses: Bonus[] = [];
    public asModal: boolean;
    public currentBonus: Bonus | null = null;
    public autoSelect: number | IAutoSelectByDevice<number>;
    public slides: ISlide[] = [];

    protected currentPaySystemId: number = 0;
    protected blankBonus: Bonus;
    protected isMobile: boolean = this.configService.get<DeviceModel>('device').isMobile;
    protected firstInit: boolean = true;
    protected paymentsAutoSelect: boolean = false;

    private promoCodeInfo: IPromoCodeInfo;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDepositBonusesCParams,
        configService: ConfigService,
        protected bonusesService: BonusesService,
        protected eventService: EventService,
        protected modalService: ModalService,
        cdr: ChangeDetectorRef,
        @Inject(WINDOW) private window: Window,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.autoSelect = this.configService.get('$finances.bonusesInDeposit.autoSelect.use')
            && this.configService.get('$finances.bonusesInDeposit.autoSelect.index');

        this.paymentsAutoSelect = this.configService.get<boolean>('$finances.payment.autoSelect')
            || this.configService.get<boolean>('$finances.lastSucceedDepositMethod.use');

        this.currentPaySystemId = this.configService.get<PaymentSystem>('chosenPaySystem')?.id;

        this.createBlankBonus();

        this.eventService.subscribe({
            name: 'select_system',
            from: 'finances',
        }, (paySystem?: PaymentSystem): void => {
            this.processPaySystemChange(paySystem);
            if (this.firstInit && !paySystem.isParent) {
                this.firstInit = false;
                this.setAutoSelect();
            }
        }, this.$destroy);

        this.followBreakpoints();
        this.promoCodeInfo = await this.bonusesService.getPromoCodeInfo();
        this.getBonuses();

        if (this.configService.get<boolean>('$finances.useDepositPromoCode') && this.$params.disableBonuses$) {
            this.$params.disableBonuses$
                .pipe(takeUntil(this.$destroy))
                .subscribe((bonus?: Bonus): void => {
                    this.processPromoCodeBonus(bonus);
                });
        }
    }

    /**
     * Returns modal button text
     */
    public get buttonText(): string {
        return this.currentBonus
            ? this.$params.modalBtnParams.notEmptyTitle
            : this.$params.modalBtnParams.subtitle;
    }

    /**
     * Handle click on modal button. Opens modal with a list of bonuses
     */
    public openModal(): void {
        this.modalService.showModal({
            id: 'deposit-bonuses',
            modalTitle: gettext('Select a bonus'),
            templateRef: this.list,
            size: 'md',
        });
    }

    /**
     * Opens a modal with description of current bonus
     */
    public openCurrentBonusInfo(): void {
        if (!this.currentBonus) {
            return;
        }

        this.modalService.showModal('bonusModal', _merge({
            bonus: this.currentBonus,
            bonusItemTheme: this.$params.itemParams?.theme,
        }, this.$params.itemParams.bonusModalParams || {}));
    }

    /**
     * Handle click on wlc-bonus-item.
     * @param bonus - `Bonus` model, if null or undefined - blank bonus is chosen
     * @param clearSame - `boolean`. If true, click on chosen bonus reset it and choose blank bonus
     */
    public bonusClickEvent(bonus?: Bonus, clearSame: boolean = true): void {
        if (bonus?.disabledBy || (!bonus && this.blankBonus.isChoose === true)) {
            return;
        }

        if (bonus?.id !== this.currentBonus?.id
            && this.modalService.getActiveModal('deposit-bonuses')) {
            this.modalService.hideModal('deposit-bonuses');
        }

        if (clearSame && bonus?.isChoose) {
            this.chooseBlankBonus();
        } else {
            this.chooseBonus(bonus);
            this.eventService.emit({
                name: bonus ? BonusItemComponentEvents.deposit : BonusItemComponentEvents.blank,
                data: bonus || null,
            });
        }

        this.cdr.markForCheck();
    }

    /**
     * Creates params for wlc-bonus-item
     * @param bonus - `Bonus` model. If bonus is null or undefined, the method returns params for blank bonus
     * @returns `IBonusItemCParams`
     */
    public getBonusItemParams(bonus?: Bonus): IBonusItemCParams {
        return _merge(<IBonusItemCParams>{
            bonus: bonus || this.blankBonus,
        }, this.$params.itemParams || {});
    }

    /**
     * Creates params for wlc-bonus-item, which is implemented as a current bonus preview on button
     * @returns `IBonusItemCParams`
     */
    public getBtnBonusItemParams(): IBonusItemCParams {
        return _merge(<IBonusItemCParams>{
            bonus: this.currentBonus,
            theme: 'mini',
            themeMod: 'simple',
            hideBonusBottom: true,
            common: {
                iconMoreBtn: null,
            },
        }, this.$params.itemParams || {});
    }

    public onSlideChange(swiper: Swiper): void {
        if (swiper.params.slidesPerView === 1 || swiper.params.slidesPerView === 'auto') {
            this.chooseBonusByPos(swiper.realIndex);
        }
    }

    protected chooseBonusByPos(index: number): void {
        const bonus: Bonus = this.slides[index].componentParams.bonus;

        if (bonus?.id) {
            this.bonusClickEvent(bonus, false);
        } else {
            this.chooseBlankBonus();
        }
    }

    /**
     * Choose blank bonus
     * @param {boolean} [silent=false] - event not emits if true
     */
    protected chooseBlankBonus(silent: boolean = false): void {
        this.blankBonus.isChoose = true;
        this.currentBonus = null;
        this.updateBonusesStatus();

        if (!silent) {
            this.eventService.emit({name: BonusItemComponentEvents.blank, data: null});
        }
    }

    protected chooseBonus(bonus: Bonus): void {
        this.blankBonus.isChoose = !bonus;
        this.currentBonus = bonus || null;
        this.updateBonusesStatus();
    }

    protected getAutoSelectedBonus(): Bonus | null {
        let index: number;

        if (_isObject(this.autoSelect)) {
            index = this.isMobile
                ? this.autoSelect.mobile
                : this.autoSelect.desktop;
        } else {
            index = this.autoSelect;
        }

        const enabled: Bonus[] = this.bonuses.filter((bonus: Bonus): boolean => !bonus.disabledBy);

        return enabled[index - 1] || enabled[0];
    }

    protected getBonuses(): void {

        this.processBonusesResponse();

        if (this.firstInit && (!this.paymentsAutoSelect || this.currentPaySystemId)) {
            this.firstInit = false;
            this.setAutoSelect();
        }
    }

    protected updateBonusesStatus(): void {
        if (!this.currentPaySystemId) {
            this.currentPaySystemId = this.configService.get<PaymentSystem>('chosenPaySystem')?.id;
        }

        this.bonuses.forEach((bonus: Bonus): void => {
            bonus.isChoose = bonus.id === this.currentBonus?.id;

            if (bonus.disabledBy === null || bonus.disabledBy === 1) {
                bonus.disabledBy = !this.currentPaySystemId
                || !bonus.paySystems.length
                || bonus.paySystems.includes(this.currentPaySystemId)
                    ? null : 1;
            }
        });
    }

    protected processBonusesResponse(): void {
        this.bonuses = this.$params.bonuses.filter((bonus: Bonus) => !bonus.isActive);

        if (Bonus.stackIsLocked) {
            this.disableBonuses(2);
        } else {
            if (Bonus.existActiveBonus) {
                this.bonuses.forEach((bonus: Bonus): void => {
                    if (!bonus.allowStack) {
                        bonus.disabledBy = 3;
                    }
                });
            }

            this.updateBonusesStatus();
        }

        if (this.currentBonus?.isChoose) {
            const bonus: Bonus = this.bonuses.find(
                (bonus: Bonus): boolean => this.currentBonus.id === bonus.id);
            this.bonusClickEvent(bonus, false);
        } else {
            this.bonusClickEvent();
        }

        const subscribedBonuses: Bonus[] = this.bonuses.filter(
            (bonus: Bonus) => bonus.isSubscribed && !bonus.disabledBy);

        if (subscribedBonuses.length === 1) {
            this.chooseBonus(subscribedBonuses[0]);
        }

        if (this.$params.type === 'swiper') {
            this.bonusesToSlides();
        }

        if (this.promoCodeInfo) {
            this.setPromoCodeInfo();
        }

        this.cdr.markForCheck();
    }

    protected createBlankBonus(): void {
        this.blankBonus = new Bonus(
            {service: 'DepositBonusesComponent', method: 'createBlankBonus'},
            (Params.defBlankBonusParams) as IBonus,
            this.configService,
        );
    }

    protected bonusesToSlides(): void {
        this.slides = this.bonuses.map((bonus: Bonus): ISlide => {
            return {
                component: BonusItemComponent,
                componentParams: _merge(this.getBonusItemParams(bonus), {
                    bonus,
                }),
            };
        });

        this.slides.unshift({
            component: BonusItemComponent,
            componentParams: {
                ...this.getBonusItemParams(),
                bonus: this.blankBonus,
            },
        });
    }

    protected disableBonuses(reason: keyof typeof disabledReasons): void {
        this.bonuses.forEach((bonus: Bonus): void => {
            bonus.disabledBy = reason;
        });
    }

    protected enableBonuses(): void {
        this.bonuses.forEach((bonus: Bonus): void => {
            bonus.disabledBy = null;
        });
    }

    protected processPromoCodeBonus(bonus?: Bonus): void {
        if (bonus) {
            this.chooseBlankBonus(true);
            this.disableBonuses(4);
            this.cdr.markForCheck();
        } else {
            this.enableBonuses();
            this.processBonusesResponse();
        }
    }

    protected setPromoCodeInfo(): void {
        const promoCodeBonus: Bonus = this.bonuses
            .find((bonus: Bonus): boolean => bonus.id === this.promoCodeInfo.bonusId);

        if (!promoCodeBonus) {
            return;
        }

        /* TODO: refactor here and there:
         * src/modules/bonuses/system/services/bonuses/bonuses.service.ts (getBonusesByCode method)
         * src/modules/bonuses/system/models/bonus/bonus.ts (promoCode getter)
         */
        promoCodeBonus.data.PromoCode = this.promoCodeInfo.promoCode;
    }

    protected processPaySystemChange(paySystem?: PaymentSystem): void {
        if (paySystem?.id < 0) {
            return;
        }

        this.currentPaySystemId = paySystem?.id || 0;
        this.updateBonusesStatus();
        this.cdr.markForCheck();
    }

    protected followBreakpoints(): void {
        const {asModal} = this.$params;

        if (asModal) {
            const breakpoint = this.window.matchMedia(asModal);
            this.asModal = breakpoint.matches;
            GlobalHelper.mediaQueryObserver(breakpoint)
                .pipe(takeUntil(this.$destroy))
                .subscribe((event: MediaQueryListEvent) => {
                    this.asModal = event.matches;
                    this.cdr.markForCheck();
                });
        }
    }

    protected setAutoSelect(): void {
        if (!this.currentBonus && this.autoSelect && this.bonuses.length > 1) {
            this.bonusClickEvent(this.getAutoSelectedBonus(), false);
        }
    }
}
