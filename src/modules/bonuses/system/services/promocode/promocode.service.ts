import {
    inject,
    Injectable,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {
    BehaviorSubject,
    Subscription,
} from 'rxjs';
import {
    filter,
} from 'rxjs/operators';

import {
    CachingService,
    ConfigService,
    DataService,
    EventService,
    IData,
    InjectionService,
    IPushMessageParams,
    LogService,
    ModalService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {
    IBonus,
    IPromoCodeInfo,
    TBonusEvent,
} from 'wlc-engine/modules/bonuses/system/interfaces';
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models';
import {UserProfile} from 'wlc-engine/modules/user';

@Injectable({
    providedIn: 'root',
})
export class PromoCodeService {
    protected readonly promoCodeCacheKey: string = 'promocode';
    protected readonly promoBonusIdCacheKey: string = 'promo-bonus-id';
    protected readonly bonusesCacheExpTime: number = 7 * 24 * 60 * 60 * 1000; // 1 week
    protected readonly cachingService: CachingService = inject(CachingService);
    protected readonly configService: ConfigService = inject(ConfigService);
    protected readonly eventService: EventService = inject(EventService);
    protected readonly translateService: TranslateService = inject(TranslateService);
    protected readonly modalService: ModalService = inject(ModalService);
    protected readonly dataService: DataService = inject(DataService);
    protected readonly logService: LogService = inject(LogService);
    protected readonly injectionService: InjectionService = inject(InjectionService);
    protected userCurrency$: BehaviorSubject<string> =
        new BehaviorSubject<string>(this.configService.get<string>('$base.defaultCurrency') || 'EUR');
    protected walletsService: WalletsService;

    protected _promoBonus: Bonus | null = null;
    protected promocodeFetchSubscriber: Subscription;
    protected promocodeFetchData: IData;

    constructor() {
        this.init();
    }

    public get promoBonus(): Bonus | null {
        return this._promoBonus;
    }

    public set promoBonus(bonus: Bonus) {
        this._promoBonus = bonus;
    }

    /** Returns promocode bonus if it exists */
    public async getBonusByCode(code: string): Promise<Bonus | null> {
        await this.savePromoCode(code);

        const bonuses: Bonus[] = await this.fetchPromoCodeBonuses(code);

        if (bonuses?.length) {
            const promoCodeBonus: Bonus = bonuses[0];

            promoCodeBonus.userPromoCode = code;
            this.updatePromoCodeBonus(promoCodeBonus);

            return promoCodeBonus;
        } else {
            this.clearPromoCodeFromCache();

            if (typeof bonuses !== 'undefined') {
                this.showPromoCodeError(gettext('The promo code has not been found'));
            }

            return null;
        }
    }

    /** Checks the existence of promoCode for the bonus */
    public isPromoCodeEntered(bonus: Bonus): boolean {
        return bonus.id === this.promoBonus?.id;
    }

    /** Returns promoCode for the bonus if it exists */
    public getPromoCode(bonus: Bonus): string | null {
        return this.isPromoCodeEntered(bonus) ? this.promoBonus.userPromoCode : null;
    }

    private async init(): Promise<void> {
        if (this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet')) {
            await this.setWalletService();
        }

        this.initPromoBonus();
        this.initSubscribers();
    }

    /** Finds promoCode in cache and init promoCode bonus */
    private async initPromoBonus(): Promise<void> {
        const promoCode: string = await this.cachingService.get<string>(this.promoCodeCacheKey);

        if (promoCode) {
            await this.getBonusByCode(promoCode);
        }
    }

    /** Processing promoBonus for authorized user  */
    public onPromoBonusSubscribed(bonus: Bonus): void {

        const modalText: string = this.prepareModalTextByEvent(bonus);

        this.modalService.showModal('promoSuccess', {
            title: gettext('Bonus success'),
            status: 'fromLink',
            texts: {
                fromLink: modalText,
            },
        });

        this.clearPromoBonus();
    }

    /** Remove info about promo bonus */
    public async clearPromoBonus(): Promise<void> {
        this.promoBonus = null;
        await this.clearPromoCodeFromCache();
    }

    /** Show notification with error info */
    public showPromoCodeError(message: string, title: string = gettext('Promo code error')): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title,
                message,
                wlcElement: 'notification_promocode-error',
            },
        });
    }

    /** Returns object with bonusId and promoCode from cache  */
    public async getPromoCodeInfo(): Promise<IPromoCodeInfo> {
        const [bonusId, promoCode] = await Promise.all([
            this.cachingService.get<number>(this.promoBonusIdCacheKey),
            this.cachingService.get<string>(this.promoCodeCacheKey),
        ]);

        if (promoCode && bonusId) {
            return {bonusId, promoCode};
        }
    }

    /** Set new promoCode bonus and save data */
    private async updatePromoCodeBonus(bonus: Bonus): Promise<void> {
        this.promoBonus = bonus;

        await Promise.all([
            this.savePromoCode(bonus.userPromoCode),
            this.savePromoBonusId(bonus.id),
        ]);
    }

    /** Prepares text after success subscribe to promo bonus from link */
    private prepareModalTextByEvent(bonus: Bonus): string {
        const event: TBonusEvent = bonus.event;
        const suffixStr: string =
            this.translateService.instant(gettext('Bonus successfully added to the Bonuses page.'));
        let prefixStr: string = this.translateService.instant(gettext('Congratulations! You have got bonus'));

        if (event === 'sign up' || event === 'registration' || event === 'verification') {
            prefixStr = this.translateService.instant(gettext('Congratulations! You activated bonus'));
        }

        return `${prefixStr} ${bonus.name}! ${suffixStr}`;
    }

    private initSubscribers(): void {
        this.setLogoutSubscriber();
        this.setUserProfileSubscriber();
    }

    private setUserProfileSubscriber(): void {
        this.configService
            .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .pipe(
                filter((profile: UserProfile) => !!profile),
            )
            .subscribe((userProfile: UserProfile) => {
                const currency: string = userProfile?.idUser
                    ? userProfile.currency
                    : this.userCurrency$.getValue();

                if (this.userCurrency$.getValue() !== currency) {
                    this.userCurrency$.next(currency);
                }
            });
    }

    private setLogoutSubscriber(): void {
        this.eventService.subscribe([
            {name: 'LOGOUT'},
        ], (): void => {
            this.clearPromoBonus();
        });
    }

    /** Saves promocode in cache */
    private async savePromoCode(code: string): Promise<void> {
        await this.cachingService.set<string>(
            this.promoCodeCacheKey,
            code,
            true,
            this.bonusesCacheExpTime,
        );
    }

    /** Saves promoBonusId in cache */
    private async savePromoBonusId(id: number): Promise<void> {
        await this.cachingService.set<number>(
            this.promoBonusIdCacheKey,
            id,
            true,
            this.bonusesCacheExpTime,
        );
    }

    private async clearPromoCodeFromCache(): Promise<void> {
        await this.cachingService.clear(this.promoCodeCacheKey);
    }

    private async fetchPromoCodeBonuses(code: string): Promise<Bonus[] | never> {
        try {
            const res: IData<IBonus[]> = await this.dataService.request({
                name: 'bonuses',
                system: 'bonuses',
                url: '/bonuses',
                type: 'GET',
            }, {
                PromoCode: code,
            });

            const promoCodeBonuses: Bonus[] = [];

            if (res.data?.length) {
                res.data.forEach((bonus: IBonus) => {
                    promoCodeBonuses.push(
                        new Bonus(
                            {service: 'PromoCodeService', method: 'fetchPromoCodeBonuses'},
                            bonus,
                            this.walletsService,
                            this.configService,
                            this.userCurrency$,
                        ),
                    );
                });
            }

            return promoCodeBonuses;
        } catch(error) {
            this.showPromoCodeError(error?.errors || error);
            this.logService.sendLog({code: '10.0.2', data: error});
            this.clearPromoBonus();
        }
    }

    private async setWalletService(): Promise<void> {
        this.walletsService ??= await this.injectionService.getService<WalletsService>('multi-wallet.wallet-service');
    }
}
