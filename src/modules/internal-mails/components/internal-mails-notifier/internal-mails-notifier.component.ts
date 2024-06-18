import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {
    filter,
    takeUntil,
} from 'rxjs/operators';

import {
    IMixedParams,
    AbstractComponent,
} from 'wlc-engine/modules/core';
import {ICounterCParams} from 'wlc-engine/modules/core/components/counter/counter.params';
import {
    InternalMailsService,
} from 'wlc-engine/modules/internal-mails/system/services/internal-mails/internal-mails.service';

import * as Params from './internal-mails-notifier.params';

@Component({
    selector: '[wlc-internal-mails-notifier]',
    templateUrl: './internal-mails-notifier.component.html',
    styleUrls: ['./styles/internal-mails-notifier.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalMailsNotifierComponent extends AbstractComponent implements OnInit {
    public hasUnread: boolean;
    public counterInlineParams: ICounterCParams = {
        type: 'internal-mails',
        theme: 'circle',
        themeMod: 'internal-mails',
    };

    constructor(
        @Inject('injectParams') protected params: Params.IInternalMailsNotifierCParams,
        protected internalMailsService: InternalMailsService,
    ) {
        super(
            <IMixedParams<Params.IInternalMailsNotifierCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.internalMailsService.unreadMailsCount$
            .pipe(
                filter((value) => this.hasUnread !== !!value),
                takeUntil(this.$destroy),
            )
            .subscribe((unreadMailsCount: number): void => {
                this.hasUnread = !!unreadMailsCount;
                this.cdr.detectChanges();
            });
    }
}
