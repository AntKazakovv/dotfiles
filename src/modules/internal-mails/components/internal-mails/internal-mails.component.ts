import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {first} from 'rxjs/operators';

import {
    ITableCParams,
    ConfigService,
    IMixedParams,
    AbstractComponent,
} from 'wlc-engine/modules/core';
import {
    InternalMailsService,
} from 'wlc-engine/modules/internal-mails/system/services/internal-mails/internal-mails.service';

import * as Params from './internal-mails.params';

@Component({
    selector: '[wlc-internal-mails]',
    templateUrl: './internal-mails.component.html',
    styleUrls: ['./styles/internal-mails.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalMailsComponent extends AbstractComponent implements OnInit {
    public ready: boolean = false;

    public tableData: ITableCParams = {
        noItemsText: gettext('No messages'),
        head: Params.internalMailsTableHeadConfig,
        rows: this.internalMailsService.mails$,
        switchWidth: (this.configService.get('$base.profile.type') === 'first') ? 1200 : 1024,
    };

    constructor(
        @Inject('injectParams') protected params: Params.IInternalMailsCParams,
        protected internalMailsService: InternalMailsService,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IInternalMailsCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.internalMailsService.mailsReady$.pipe(first()).subscribe(() => {
            this.ready = true;
            this.cdr.detectChanges();
        });
    }
}
