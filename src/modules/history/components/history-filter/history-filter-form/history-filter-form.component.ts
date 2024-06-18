import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';

import * as Params from './history-filter-form.params';

export {IHistoryFilterFormCParams} from './history-filter-form.params';

@Component({
    selector: '[wlc-history-filter-form]',
    templateUrl: './history-filter-form.component.html',
    styleUrls: ['./styles/history-filter-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HistoryFilterFormComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IHistoryFilterFormCParams;

    public override $params: Params.IHistoryFilterFormCParams;
    public formData: BehaviorSubject<IIndexing<any>>;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IHistoryFilterFormCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.formData = this.$params.formData;
    }
}
