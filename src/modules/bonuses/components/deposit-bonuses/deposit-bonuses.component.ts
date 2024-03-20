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
import {
    filter,
    takeUntil,
} from 'rxjs/operators';
import {Subject} from 'rxjs';
import _forEach from 'lodash-es/forEach';
import _merge from 'lodash-es/merge';
import _isObject from 'lodash-es/isObject';
import _filter from 'lodash-es/filter';
import _map from 'lodash-es/map';

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
} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';
import {BonusItemComponent} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.component';
import {IBonusItemCParams} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.params';
import {
    BonusesListController,
    IBonusesListController,
} from 'wlc-engine/modules/bonuses/system/classes/bonuses-list.controller';
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
    public ready: boolean = false;
    public asModal: boolean;
    public currentBonus: Bonus | null = null;
    public autoSelect: number | IAutoSelectByDevice<number>;
    public noBonusesText: string = gettext('Available bonuses are not found');
    public slides: ISlide[] = [];

    protected currentPaySystemId: number = 0;
    protected blankBonus: Bonus;
    protected isMobile: boolean = this.configService.get<DeviceModel>('device').isMobile;
    protected firstInit: boolean = true;
    protected paymentsAutoSelect: boolean = false;
    protected bonusesListController: IBonusesListController;

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

        this.bonusesListController = new BonusesListController(
            this.bonusesService,
            this.configService,
        );
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.autoSelect = this.configService.get('$finances.bonusesInDeposit.autoSelect.use')
            && this.configService.get('$finances.bonusesInDeposit.autoSelect.index');

        this.paymentsAutoSelect = this.configService.get<boolean>('$finances.payment.autoSelect')
            || this.configService.get<boolean>('$finances.lastSucceedDepositMethod.use');

        this.currentPaySystemId = this.configService.get<PaymentSystem>('chosenPaySystem')?.id;

        this.createBlankBonus();

        this.bonusesListController.ready$
            .pipe(takeUntil(this.$destroy))
            .subscribe((ready) => {
                this.ready = ready;
                this.cdr.markForCheck();
            });

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
            this.blankBonus.isChoose = !bonus;
            this.currentBonus = bonus || null;
            this.updateBonusesStatus();
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
        const errorCatcher$: Subject<boolean> = new Subject();
        errorCatcher$.pipe(
            filter((isReady: boolean) => isReady && !this.bonuses.length),
            takeUntil(this.$destroy),
        ).subscribe((): void => {
            this.ready = true;
            this.cdr.markForCheck();
        });

        const processBonuses = (bonuses: Bonus[]): void => {
            this.processBonusesResponse(bonuses);

            if (this.firstInit && (!this.paymentsAutoSelect || this.currentPaySystemId)) {
                this.firstInit = false;
                this.setAutoSelect();
            }
        };

        if (this.$params.bonuses?.length) {
            processBonuses(this.$params.bonuses);
        } else {
            this.bonusesListController.getBonuses({
                subscribeParams: {
                    type: 'any',
                    useQuery: true,
                },
                filter: this.$params.filter,
            });

            this.bonusesListController.bonuses$.pipe(
                takeUntil(this.$destroy),
            ).subscribe((bonuses: Bonus[]): void => {
                processBonuses(bonuses);
            });
        }
    }

    protected updateBonusesStatus(): void {
        if (!this.ready && !this.currentPaySystemId) {
            this.currentPaySystemId = this.configService.get<PaymentSystem>('chosenPaySystem')?.id;
        }

        _forEach(this.bonuses, (bonus: Bonus): void => {
            bonus.isChoose = bonus.id === this.currentBonus?.id;

            if (bonus.disabledBy === null || bonus.disabledBy === 1) {
                bonus.disabledBy = !this.currentPaySystemId
                || !bonus.paySystems.length
                || bonus.paySystems.includes(this.currentPaySystemId)
                    ? null : 1;
            }
        });
    }

    protected processBonusesResponse(bonuses: Bonus[]): void {
        this.ready = true;
        if (bonuses.length) {
            this.bonuses = _filter(bonuses, {isActive: false, showOnly: false});

            if (Bonus.stackIsLocked) {
                this.disableBonuses(2);
            } else {
                if (Bonus.existActiveBonus) {

                    _forEach(this.bonuses, (bonus: Bonus): void => {
                        if (!bonus.allowStack) {
                            bonus.disabledBy = 3;
                        }
                    });
                }
            }

            this.updateBonusesStatus();

            if (this.ready) {
                if (this.currentBonus?.isChoose) {
                    const bonus: Bonus = this.bonuses.find(
                        (bonus: Bonus): boolean => this.currentBonus.id === bonus.id);
                    this.bonusClickEvent(bonus, false);
                } else {
                    this.bonusClickEvent();
                }
            } else if (this.currentPaySystemId) {
                this.setAutoSelect();
            }

            if (this.$params.type === 'swiper') {
                this.bonusesToSlides();
            }
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
        this.slides = _map(this.bonuses, (bonus: Bonus): ISlide => {
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
        _forEach(this.bonuses, (bonus: Bonus): void => {
            bonus.disabledBy = reason;
        });
    }

    protected enableBonuses(): void {
        _forEach(this.bonuses, (bonus: Bonus): void => {
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
            this.processBonusesResponse(this.bonuses);
        }
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
