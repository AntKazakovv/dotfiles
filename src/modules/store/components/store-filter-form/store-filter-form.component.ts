import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';

import * as Params from './store-filter-form.params';

export {IStoreFilterFormCParams} from './store-filter-form.params';

@Component({
    selector: '[wlc-store-filter-form]',
    templateUrl: './store-filter-form.component.html',
    styleUrls: ['./styles/store-filter-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class StoreFilterFormComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.IStoreFilterFormCParams;

    public override $params: Params.IStoreFilterFormCParams;
    public formData: BehaviorSubject<IIndexing<any>>;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IStoreFilterFormCParams,
        configService: ConfigService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.formData = this.$params.formData;
    }
}
