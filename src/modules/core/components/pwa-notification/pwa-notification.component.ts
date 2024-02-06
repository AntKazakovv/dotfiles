import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    ChangeDetectionStrategy,
    ElementRef,
} from '@angular/core';
import {
    UIRouter,
} from '@uirouter/core';

import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {
    PWA_NOTOFICATION_HIDE,
    PWA_NOTOFICATION_HIDE_STORAGE_TYPE,
} from 'wlc-engine/modules/core/constants/storage.contants';

import * as Params from './pwa-notification.params';

@Component({
    selector: '[wlc-pwa-notification]',
    templateUrl: './pwa-notification.component.html',
    styleUrls: ['./styles/pwa-notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PwaNotificationComponent extends AbstractComponent implements OnInit {

    constructor(
        @Inject('injectParams') protected params: Params.IPwaNotificationCParams,
        protected router: UIRouter,
        protected eventService: EventService,
        configService: ConfigService,
        protected injectionService: InjectionService,
        cdr: ChangeDetectorRef,
        protected el: ElementRef,
    ) {
        super(
            <IMixedParams<Params.IPwaNotificationCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        await this.configService.ready;
        this.addModifiers('show');
        this.changeVisibility(this.enabled());
    }

    public openInstruction(): void {
        this.router.stateService.go('app.pages', {slug: 'install-pwa'});
        this.close();
    }

    public close(): void {
        this.configService.set({
            name: PWA_NOTOFICATION_HIDE,
            value: true,
            storageType: PWA_NOTOFICATION_HIDE_STORAGE_TYPE,
        });
        this.changeVisibility(false);
    }

    protected enabled(): boolean {
        return !this.configService.get({
            name: PWA_NOTOFICATION_HIDE,
            storageType: PWA_NOTOFICATION_HIDE_STORAGE_TYPE,
        });
    }

    protected changeVisibility(show: boolean): void {
        if (!show) {
            this.el.nativeElement.remove();
        }
    }
}
