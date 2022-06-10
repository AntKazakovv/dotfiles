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
} from 'rxjs';
import {first} from 'rxjs/operators';

import {
    ConfigService,
    ICountry,
} from 'wlc-engine/modules/core';
import {IForbiddenCountryParams} from 'wlc-engine/modules/core/components/forbidden-country/forbidden-country.params';
import {
    IModalParams,
    ModalService,
} from 'wlc-engine/modules/core/system/services/modal/modal.service';

@Injectable({
    providedIn: 'root',
})
export class ForbiddenCountryService {
    private forbiddenModalRemove$: Subscription;

    constructor(
        private configService: ConfigService,
        private modalService: ModalService,
        private router: UIRouter,
        @Inject(DOCUMENT) private document: Document,
    ) {}

    public async showModal(): Promise<void> {
        const modal: IModalParams = {
            id: 'forbidden-country',
            size: 'md',
            componentName: 'core.wlc-forbidden-country',
            componentParams: await this.getForbiddenCountryParams(),
            closeBtnVisibility: false,
            ignoreBackdropClick: true,
            showFooter: false,
            backdrop: 'static',
        };

        await this.modalService.showModal(modal);

        this.setForbiddenModalEventListeners();
    }

    public blockUrlChanging(): void {
        this.router.urlService.onChange(() => {
            this.router.stateService.go('app.home');
        });
    }

    public isForbidden(): boolean {
        const settingEnabled = this.configService.get<boolean>('$base.restrictions.country.use');
        const restricted = this.configService.get<boolean>('appConfig.countryRestricted');

        return settingEnabled && restricted;
    }

    private setForbiddenModalEventListeners(): void {
        setTimeout(() => {
            if (!this.forbiddenModalRemove$) {
                const element = this.document.querySelector('.wlc-modal--forbidden-country');

                if (element) {
                    this.forbiddenModalRemove$ = fromEvent(element, 'DOMNodeRemoved')
                        .subscribe(() => {
                            this.forbiddenModalRemove$ = null;
                            return this.showModal();
                        });
                }
            }
        }, 500);
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
        const countries = await this.configService.get<BehaviorSubject<ICountry[]>>('countries')
            .pipe(first((v) => !!v.length))
            .toPromise();

        const found = countries.find((c) => c.iso3 === code);

        return found?.title ?? gettext('your country');
    }
}
