import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
} from '@angular/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {
    AbstractComponent,
    IMixedParams,
    EventService,
    ITableCParams,
    IIndexing,
    IData,
} from 'wlc-engine/modules/core';

import * as Params from './loyalty-levels.params';


import {
    values as _values,
} from 'lodash-es';
import {BehaviorSubject} from "rxjs";


@Component({
    selector: '[wlc-loyalty-levels]',
    templateUrl: './loyalty-levels.component.html',
    styleUrls: ['./styles/loyalty-levels.component.scss'],
})
export class LoyaltyLevelsComponent extends AbstractComponent implements OnInit {

    public ready = false;

    public $params: Params.ILoyaltyLevelTableCParams;
    public levels: BehaviorSubject<IIndexing<string>[]> = new BehaviorSubject([]);

    public tableData: ITableCParams = {
        noItemsText: gettext('No transaction history'),
        head: Params.loyaltyTableHeadConfig,
        rows: this.levels,
    };

    constructor(
        @Inject('injectParams') protected params: Params.ILoyaltyLevelTableCParams,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected userService: UserService,
    )
    {
        super(
            <IMixedParams<Params.ILoyaltyLevelTableCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.levels.next(_values((await this.userService.getLoyaltyLevels() as IData).data));
        this.ready = true;
        this.cdr.detectChanges();
    }
}
