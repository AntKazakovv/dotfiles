import {
    Component,
    OnInit,
    Input,
    ChangeDetectorRef,
    Inject,
} from '@angular/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes';

import * as Params from './pagination.params';

@Component({
    selector: '[wlc-pagination]',
    templateUrl: './pagination.component.html',
    styleUrls: ['./styles/pagination.component.scss'],
})
export class WlcPaginationComponent extends AbstractComponent implements OnInit {
    @Input() data: any;
    @Input() totalItems: number;
    @Input() pageChanged: any;
    @Input() itemPerPage: number;

    public $params: Params.IPaginationCParams;
    public currentPage: number;

    constructor(
        @Inject('injectParams') protected params: Params.IPaginationCParams,
        protected cdr: ChangeDetectorRef,
    )
    {
        super(
            <IMixedParams<Params.IPaginationCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }
}
