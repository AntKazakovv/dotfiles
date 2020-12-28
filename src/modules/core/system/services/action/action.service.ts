import {Injectable, Injector} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {BehaviorSubject, fromEvent} from 'rxjs';
import {Observable} from 'rxjs';
import {takeWhile, filter} from 'rxjs/operators';
import {
    ConfigService,
    DeviceModel,
    IDeviceConfig,
    DeviceType,
    IIndexing,
    ModalService,
    LayoutService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';

@Injectable({
    providedIn: 'root',
})
export class ActionService {
    public windowResize: Observable<Event> = fromEvent(window, 'resize');

    constructor(
        private configService: ConfigService,
        private modalService: ModalService,
        private userService: UserService,
        private layoutService: LayoutService,
    ) {
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
                    this.userService.registrationComplete(initialPath.code);
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

        const device = this.configService.get<DeviceModel>('device'),
            getDeviceType = (): DeviceType => {
                const breakpoints = this.configService.get<IDeviceConfig>('$base.device')?.breakpoints;
                if (device.windowWidth < breakpoints?.tablet) {
                    return DeviceType.Mobile;
                } else if (device.windowWidth >= breakpoints?.tablet && device.windowWidth < breakpoints?.desktop) {
                    return DeviceType.Tablet;
                } else {
                    return DeviceType.Desktop;
                }
            },
            handler = new BehaviorSubject<DeviceType>(getDeviceType());
        let currentType = getDeviceType();

        this.windowResize.pipe(
            takeWhile(() => !!handler.observers.length),
            filter((): boolean => {
                const result = getDeviceType() !== currentType;
                currentType = getDeviceType();
                return result;
            }),
        ).subscribe(() => handler.next(getDeviceType()));

        return handler;
    }
}
