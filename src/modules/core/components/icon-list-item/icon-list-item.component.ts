import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ViewEncapsulation,
    SimpleChanges,
    OnChanges,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {IconModel} from 'wlc-engine/modules/core/system/models/icon-list-item.model';

import * as Params from './icon-list-item.params';

@Component({
    selector: '[wlc-icon-list-item]',
    templateUrl: './icon-list-item.component.html',
    styleUrls: ['./styles/icon-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})

export class IconListItemComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input() protected inlineParams: Params.IIconListItemCParams;
    @Input() public icon: IconModel;

    public $params: Params.IIconListItemCParams;
    public error: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IIconListItemCParams,
        protected configService: ConfigService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        if (!this.icon) {
            this.icon = this.$params.icon;
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['icon']) {
            this.error = false;
        }
    }

    public errorHandler(): void {
        this.error = true;
    }

}
