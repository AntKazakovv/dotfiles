import {
    ChangeDetectorRef,
    Component,
    OnInit,
    Inject,
    Self,
    Optional,
    ChangeDetectionStrategy,
} from '@angular/core';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {PIQCashierServiceEvents} from 'wlc-engine/modules/finances/system/services/piq-cashier/piq-cashier.service';

import * as Params from './piq-cashier.params';

@Component({
    selector: '[wlc-piq-cashier]',
    templateUrl: './piq-cashier.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PIQCashierComponent extends AbstractComponent implements OnInit {

    public ready = false;

    public $params: Params.IPIQCashierCParams;

    constructor(
        @Self()
        @Optional()
        @Inject('injectParams')
        protected injectParams: Params.IPIQCashierCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected eventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.setHandlers();
    }

    protected setHandlers(): void {
        this.eventService.subscribe(
            {
                name: PIQCashierServiceEvents.loadSuccess,
                from: 'piq-cashier',
            },
            () => {
                this.ready = true;
                this.cdr.markForCheck();
            },
            this.$destroy,
        );
    }
}
