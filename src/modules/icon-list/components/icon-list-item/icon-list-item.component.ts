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
    LogService,
} from 'wlc-engine/modules/core';
import {IconModel} from 'wlc-engine/modules/icon-list/system/models/icon-list-item.model';

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
    @Input() protected logImageErrorChild: Params.TIconErrorCode;
    @Input() public icon: IconModel;

    public override $params: Params.IIconListItemCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IIconListItemCParams,
        configService: ConfigService,
        protected logService: LogService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        if (!this.icon) {
            this.icon = this.$params.icon;
        }
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        if (changes['icon']) {
            this.icon.isError = false;
        }
    }

    public errorHandler(): void {
        this.icon.isError = true;
        this.logService.sendLog({
            code: (this.logImageErrorChild !== true) ? this.logImageErrorChild : '1.4.0',
            flog: {
                iconName: this.icon.data.alt,
                iconUrl: this.icon.data.iconUrl,
            },
        });
    }

}
