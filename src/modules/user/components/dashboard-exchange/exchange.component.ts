import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService, ILoyalty} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {ModalService} from 'wlc-engine/modules/core/system/services';
import * as Params from './exchange.params';

import {
    reduce as _reduce,
    assign as _assign,
} from 'lodash';

@Component({
    selector: '[wlc-exchange]',
    templateUrl: './exchange.component.html',
    styleUrls: ['./styles/exchange.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.IExchangeCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IExchangeCParams,
        protected configService: ConfigService,
        protected UserService: UserService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
