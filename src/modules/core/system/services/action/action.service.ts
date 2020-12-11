import {Injectable} from '@angular/core';
import {BehaviorSubject, fromEvent} from 'rxjs';
import {Observable} from 'rxjs';
import {takeWhile, filter} from 'rxjs/operators';
import {ConfigService, DeviceModel, IDeviceConfig, IDeviceType} from 'wlc-engine/modules/core';

@Injectable({
    providedIn: 'root',
})
export class ActionService {
    public windowResize: Observable<Event> = fromEvent(window, 'resize');

    constructor(
        private configService: ConfigService,
    ) {}

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
