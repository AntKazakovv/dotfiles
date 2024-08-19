import {
    Inject,
    Injectable,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {UIRouter} from '@uirouter/core';

import {
    fromEvent,
    BehaviorSubject,
    Subscription,
    firstValueFrom,
    asyncScheduler,
} from 'rxjs';
import {
    first,
    throttleTime,
} from 'rxjs/operators';

import {ICountry} from 'wlc-engine/modules/core/system/interfaces/fundist.interface';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {IForbiddenCountryParams} from 'wlc-engine/modules/core/components/forbidden-country/forbidden-country.params';
import {
    IModalParams,
    ModalService,
} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

@Injectable({
    providedIn: 'root',
})
export class ForbiddenCountryService {
    private forbiddenModalRemove$: Subscription;
    private listenerForForbiddenModal: Subscription;

    constructor(
        private configService: ConfigService,
        private modalService: ModalService,
        private router: UIRouter,
        @Inject(DOCUMENT) private document: Document,
    ) {}

    public async showModal(fullScreenMobileVal: boolean): Promise<void> {
        const modal: IModalParams = {
            id: 'forbidden-country',
            size: 'md',
            componentName: 'core.wlc-forbidden-country',
            componentParams: await this.getForbiddenCountryParams(),
            closeBtnVisibility: false,
            ignoreBackdropClick: false,
            showFooter: false,
            forbiddenScreenMobile: fullScreenMobileVal,
            backdrop: 'static',
            keyboard: false,
            showConfirmBtn: false,
        };
        await this.modalService.showModal(modal);

        this.setForbiddenModalEventListeners();
    }

    public blockUrlChanging(): void {
        this.router.urlService.onChange(() => {
            this.router.stateService.go('app.home');
        });
    }

    private setForbiddenModalEventListeners(): void {
        const updateForbiddenThrottleTime: number = 1000;

        this.listenerForForbiddenModal = GlobalHelper.createMutationObserver(
            this.document.body,
            {
                childList: true,
                subtree: true,
            })
            .pipe(
                throttleTime(updateForbiddenThrottleTime, asyncScheduler, {trailing: true}),
            )
            .subscribe(() => {
                if (!this.forbiddenModalRemove$) {
                    const element = this.document.querySelector('.wlc-modal--forbidden-country');

                    if (element) {
                        this.forbiddenModalRemove$ = fromEvent(element, 'DOMNodeRemoved')
                            .subscribe(() => {
                                this.forbiddenModalRemove$.unsubscribe();
                                this.forbiddenModalRemove$ = null;
                                this.modalService.closeAllModals();
                                this.listenerForForbiddenModal.unsubscribe();
                                return this.showModal(this.configService.get<boolean>(
                                    '$base.restrictions.country.fullScreenModal') || false);
                            });
                    }
                }
            });
    }

    private async getForbiddenCountryParams(): Promise<IForbiddenCountryParams> {
        const casinoName = this.configService.get<string>('$base.site.name') ?? '';
        const supportEmail = this.configService.get<string>('$base.contacts.email') ?? '';
        const countryName = await this.getUserCountry();

        return {
            countryName,
            casinoName,
            supportEmail,
        };
    }

    private async getUserCountry(): Promise<string> {
        const code = this.configService.get<string>('appConfig.country');
        const countries = await firstValueFrom(
            this.configService.get<BehaviorSubject<ICountry[]>>('countries')
                .pipe(first((v) => !!v.length)),
        );

        const userCountry = countries.find((c) => c.iso3 === code);

        return userCountry?.title ?? gettext('your country');
    }
}
