import {Injectable, Injector} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {
    BehaviorSubject,
    fromEvent,
    fromEventPattern,
} from 'rxjs';
import {Observable} from 'rxjs';
import {takeWhile} from 'rxjs/operators';
import {
    ConfigService,
    IDeviceConfig,
    DeviceType,
    IIndexing,
    ModalService,
    LayoutService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';

import {
    forEach as _forEach,
} from 'lodash';

export interface IBreakpoint {
    mq: MediaQueryList;
    observer: Observable<MediaQueryListEvent>;
};

export interface IDeviceBreakpoints {
    mobile: IBreakpoint;
    tablet: IBreakpoint;
    desktop: IBreakpoint;
};

@Injectable({
    providedIn: 'root',
})
export class ActionService {
    public breakpoints: IDeviceBreakpoints;
    private deviceTypeSubject: BehaviorSubject<DeviceType> = new BehaviorSubject(null)

    constructor(
        private injector: Injector,
        private configService: ConfigService,
        private modalService: ModalService,
        private layoutService: LayoutService,
    ) {
        this.createBreakpoints();
    }

    public async processMessages(initialPath: IIndexing<string>): Promise<void> {
        switch (initialPath?.message) {
            case 'PAYMENT_SUCCESS':
                this.modalService.showModal({
                    id: 'payment-success',
                    modifier: 'info',
                    modalTitle: gettext('Success'),
                    modalMessage: [
                        gettext('Deposit completed successfully'),
                        new CurrencyPipe('en_US', 'EUR').transform(initialPath.amount)
                            + ' ' + gettext('were successfully deposited in your account.'),
                    ],
                    closeBtnText: gettext('Ok'),
                });
                break;
            case 'PAYMENT_FAIL':
                this.modalService.showError({
                    modalMessage: [
                        gettext('Unfortunately your payment didn\'t go through.'
                            +' An e-mail with detailed information has been sent to your e-mail address.'
                            +' If you have any questions, please don\'t hesitate to contact us.'),
                    ],
                });
                break;
            case 'SET_NEW_PASSWORD':
                await this.configService.ready;
                await this.layoutService.importModules(['user']);

                this.modalService.showModal('newPassword');
                break;
            case 'COMPLETE_REGISTRATION':
                if (initialPath.code) {
                    await this.configService.ready;
                    await this.layoutService.importModules(['games']);
                    const userService = this.injector.get(UserService);
                    userService.registrationComplete(initialPath.code);
                } else {
                    this.modalService.showError({
                        modalMessage: [
                            gettext('Code missing'),
                        ],
                    });
                }
                break;
            case 'EMAIL_UNSUBSCRIBE':
                //TODO
                break;
            case 'FINALIZE_SOCIAL_CONNECT':
                //TODO
                break;
            // case 'FINALIZE_SOCIAL_REGISTRATION':
            //     UserSocialRegisterService.init();
            //     break;
        }
    }

    public scrollTo(selector: string): void {
        setTimeout(() => {
            const element = selector ?
                document.querySelector(selector) :
                document.querySelector('body');

            setTimeout(() => {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }, 100);
        }, 0);
    }

    public deviceType(): BehaviorSubject<DeviceType> {
        const getDeviceType = (): DeviceType => {
            if (this.breakpoints.desktop.mq.matches) {
                return DeviceType.Desktop;
            } else if (this.breakpoints.tablet.mq.matches) {
                return DeviceType.Tablet;
            } else {
                return DeviceType.Mobile;
            }
        };

        _forEach(this.breakpoints, (item: IBreakpoint) => {
            item.observer
                .pipe(takeWhile(() => !!this.deviceTypeSubject.observers.length))
                .subscribe(() => this.deviceTypeSubject.next(getDeviceType()));
        });

        return this.deviceTypeSubject;
    }

    private async createBreakpoints(): Promise<void> {
        await this.configService.ready;
        const breakpoints = this.configService.get<IDeviceConfig>('$base.device')?.breakpoints;

        this.breakpoints = {
            mobile: this.createMq(breakpoints?.mobile),
            tablet: this.createMq(breakpoints?.tablet),
            desktop: this.createMq(breakpoints?.desktop),
        };
    }

    private createMq(mq: number): IBreakpoint {
        const mediaQuery = window.matchMedia(`(min-width: ${mq}px)`);
        return {
            mq: mediaQuery,
            observer: fromEvent<MediaQueryListEvent>(mediaQuery, 'change'),
        };
    }
}
