import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    ChangeDetectorRef,
    ViewChild,
    TemplateRef,
} from '@angular/core';

import {
    filter,
    takeUntil,
} from 'rxjs/operators';
import {Subject} from 'rxjs';
import _forEach from 'lodash-es/forEach';
import _merge from 'lodash-es/merge';
import _isObject from 'lodash-es/isObject';

import {
    AbstractComponent,
    ConfigService,
    DeviceModel,
    EventService,
    GlobalHelper,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    IAutoSelectByDevice,
    PaymentSystem,
} from 'wlc-engine/modules/finances';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services';
import {BonusItemComponentEvents} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses.interface';
import {IBlankBonusParams} from 'wlc-engine/modules/bonuses/components/bonuses-list/bonuses-list.params';
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

    public $params: Params.IDepositBonusesCParams;
    public bonuses: Bonus[] = [];
    public ready: boolean = false;
    public asModal: boolean;
    public currentBonus: Bonus | null = null;
    public autoSelect: number | IAutoSelectByDevice<number>;
    public noBonusesText: string = gettext('Available bonuses are not found');

    protected currentPaySystemId: number = 0;
    protected blankBonus: IBlankBonusParams;
    protected isMobile: boolean = this.configService.get<DeviceModel>('device').isMobile;
    protected firstInit: boolean = true;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDepositBonusesCParams,
        protected configService: ConfigService,
        protected bonusesService: BonusesService,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected cdr: ChangeDetectorRef,
        @Inject(WINDOW) private window: Window,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.autoSelect = this.configService.get('$finances.bonusesInDeposit.autoSelect.use')
            && this.configService.get('$finances.bonusesInDeposit.autoSelect.index');

        this.blankBonus = {
            ...Params.defBlankBonusParams,
            ...this.$params.blankBonus,
        };

        this.eventService.subscribe({
            name: 'select_system',
            from: 'finances',
        }, (paySystem?: PaymentSystem): void => {
            this.processPaySystemChange(paySystem);
            if (this.firstInit) {
                this.firstInit = false;
                this.setAutoSelect();
            }
        }, this.$destroy);

        this.followBreakpoints();
        this.getBonuses();
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
    public openModal():void {
        this.modalService.showModal({
            id: 'deposit-bonuses',
            modalTitle: gettext('Choose bonus'),
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
            this.blankBonus.isChoose = true;
            this.currentBonus = null;
            this.updateBonusesStatus();
            this.eventService.emit({name: BonusItemComponentEvents.blank, data: null});
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
            takeUntil(this.$destroy),
            filter((isReady: boolean) => isReady && !this.bonuses.length),
        ).subscribe((): void => {
            this.ready = true;
            this.cdr.markForCheck();
        });

        this.bonusesService.getSubscribe({
            type: 'any',
            useQuery: true,
            ready$: errorCatcher$,
            observer: {
                next: (bonuses: Bonus[]): void => {
                    this.processBonusesResponse(bonuses || []);
                },
            },
        });
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
        if (bonuses.length) {
            this.bonuses = this.bonusesService.filterBonuses(bonuses, this.$params.filter);
            const activeBonuses: Bonus[] = this.bonusesService.filterBonuses(bonuses, 'active');

            if (activeBonuses.some((bonus: Bonus) => !bonus.allowStack)) {
                _forEach(this.bonuses, (bonus: Bonus): void => {
                    bonus.disabledBy = 2;
                });
            } else if (activeBonuses.some((bonus: Bonus) => bonus.allowStack)) {
                _forEach(this.bonuses, (bonus: Bonus): void => {
                    if (!bonus.allowStack) {
                        bonus.disabledBy = 3;
                    }
                });
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
        }

        this.ready = true;
        this.cdr.markForCheck();
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
