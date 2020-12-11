import {Injectable} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {BehaviorSubject, fromEvent} from 'rxjs';
import {Observable} from 'rxjs';
import {takeWhile, filter} from 'rxjs/operators';
import {
    ConfigService,
    DeviceModel,
    IDeviceConfig,
    IDeviceType,
    IIndexing,
    ModalService,
} from 'wlc-engine/modules/core';

@Injectable({
    providedIn: 'root',
})
export class ActionService {
    public windowResize: Observable<Event> = fromEvent(window, 'resize');

    constructor(
        private configService: ConfigService,
        private modalService: ModalService,
    ) {
    }

    public processMessages(initialPath: IIndexing<string>): void {
        switch(initialPath?.message) {
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
                            +' An e-mail with detailed information has been sent to your e-mail address.'+
                            ' If you have any questions, please don\'t hesitate to contact us.'),
                    ],
                });
                break;
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

    public deviceType(): BehaviorSubject<IDeviceType> {

        const device = this.configService.get<DeviceModel>('device'),
            getDeviceType = (): IDeviceType => {
                const breakpoints = this.configService.get<IDeviceConfig>('$base.device')?.breakpoints;
                if (device.windowWidth < breakpoints?.tablet) {
                    return 'mobile';
                } else if (device.windowWidth >= breakpoints?.tablet && device.windowWidth < breakpoints?.desktop) {
                    return 'tablet';
                } else {
                    return 'desktop';
                }
            },
            handler = new BehaviorSubject<IDeviceType>(getDeviceType());
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
