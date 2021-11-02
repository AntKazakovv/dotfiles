import {
    Component,
    ChangeDetectorRef,
    Inject,
    ChangeDetectionStrategy,
    OnInit,
} from '@angular/core';
import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import * as Params from './history-name.params';

@Component({
    selector: '[wlc-history-name]',
    templateUrl: './history-name.component.html',
    styleUrls: ['./history-name.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryNameComponent extends AbstractComponent implements OnInit {

    public $params: Params.IHistoryNameParams;

    constructor(
        @Inject('injectParams') protected params: Params.IHistoryNameParams,
        protected cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.IHistoryNameParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }
}
