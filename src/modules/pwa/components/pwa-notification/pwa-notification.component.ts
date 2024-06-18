import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';

import {takeUntil} from 'rxjs/operators';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core';

import {PwaNotificationController} from './controller/pwa-notification.controller';
import * as Params from './pwa-notification.params';

@Component({
    selector: '[wlc-pwa-notification]',
    templateUrl: './pwa-notification.component.html',
    styleUrls: ['./styles/pwa-notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PwaNotificationController],
})
export class PwaNotificationComponent extends AbstractComponent implements OnInit {

    public override $params: Params.IPwaNotificationCParams;

    protected readonly pwaNotificationCtrl = inject(PwaNotificationController);

    constructor(
        @Inject('injectParams') protected params: Params.IPwaNotificationCParams,
    ) {
        super(
            <IMixedParams<Params.IPwaNotificationCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.visibilityHandler();
        this.pwaNotificationCtrl.init({
            excludeStates: this.$params.excludeStates,
        });
    }

    public openInstruction(): void {
        this.pwaNotificationCtrl.openInstruction();
    }

    public close(): void {
        this.pwaNotificationCtrl.close();
    }

    protected visibilityHandler(): void {
        this.pwaNotificationCtrl.visible$
            .pipe(takeUntil(this.$destroy))
            .subscribe((show: boolean) => {
                if (!show) {
                    this.removeModifiers('show');
                } else {
                    this.addModifiers('show');
                }
            });
    }
}
