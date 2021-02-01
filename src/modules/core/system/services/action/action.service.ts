import {
    Injectable,
    Injector,
} from '@angular/core';
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
    DeviceType,
    EventService,
    IDeviceConfig,
    IIndexing,
    LayoutService,
    ModalService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';

import {
    forEach as _forEach,
} from 'lodash-es';

export interface IBreakpoint {
    mq: MediaQueryList;
    observer: Observable<MediaQueryListEvent>;
}

export interface IDeviceBreakpoints {
    mobile: IBreakpoint;
    tablet: IBreakpoint;
    desktop: IBreakpoint;
}

@Injectable({
    providedIn: 'root',
})
export class ActionService {
    public breakpoints: IDeviceBreakpoints;
    private deviceTypeSubject: BehaviorSubject<DeviceType> = new BehaviorSubject(null);

    constructor(
        private injector: Injector,
        private configService: ConfigService,
        private eventService: EventService,
        private layoutService: LayoutService,
        private modalService: ModalService,
    ) {
        this.init();
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
                this.setNewPassword(initialPath);
                break;
            case 'COMPLETE_REGISTRATION':
                this.completeRegistration(initialPath);
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
        _forEach(this.breakpoints, (item: IBreakpoint) => {
            item.observer
                .pipe(takeWhile(() => !!this.deviceTypeSubject.observers.length))
                .subscribe(() => this.deviceTypeSubject.next(this.getDeviceType()));
        });
        return this.deviceTypeSubject;
    }

    private async init(): Promise<void> {
        await this.createBreakpoints();
        this.deviceTypeSubject.next(this.getDeviceType());
    }

    private getDeviceType(): DeviceType {
        if (this.breakpoints.desktop.mq.matches) {
            return DeviceType.Desktop;
        } else if (this.breakpoints.tablet.mq.matches) {
            return DeviceType.Tablet;
        } else {
            return DeviceType.Mobile;
        }
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

    private async setNewPassword(initialPath: IIndexing<string>): Promise<void> {
        if (!initialPath.code) {
            this.showErrorModal('Code missing');
            return;
        }

        await this.configService.ready;
        await this.layoutService.importModules(['user']);

        try {
            const userService: UserService = this.injector.get(UserService);
            await userService.validateRestoreCode(initialPath.code);
        } catch (error) {
            const message = gettext('Error occured during password recovery');

            this.modalService.showError({
                modalMessage: [message, ...error.errors],
            });

            return;
        }

        this.modalService.showModal('newPassword',
            {
                common: {
                    code: initialPath.code,
                },
            });
    }

    private async completeRegistration(initialPath: IIndexing<string>): Promise<void> {
        if (!initialPath.code) {
            this.showErrorModal('Code missing');
            return;
        }

        await this.configService.ready;
        await this.layoutService.importModules(['games']);
        const userService: UserService = this.injector.get(UserService);

        try {
            this.modalService.showModal('registrationSuccess');
            await userService.registrationComplete(initialPath.code);
            this.modalService.closeAllModals();
            this.eventService.emit({name: 'LOGIN'});
        } catch (error) {
            this.modalService.showError({
                modalMessage: error.errors,
            });
        }

    }

    private showErrorModal(message: string): void {
        this.modalService.showError({
            modalMessage: [
                gettext(message),
            ],
        });
    }
}
