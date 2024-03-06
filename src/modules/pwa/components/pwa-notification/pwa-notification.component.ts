import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';

import {takeUntil} from 'rxjs/operators';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
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

    protected override readonly cdr = inject(ChangeDetectorRef);
    protected override readonly configService = inject(ConfigService);

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
        this.pwaNotificationCtrl.init({
            excludeStates: this.$params.excludeStates,
        });
        this.visibilityHandler();
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
