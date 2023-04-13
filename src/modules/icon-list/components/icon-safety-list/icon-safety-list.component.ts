import {
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {IconListAbstract} from 'wlc-engine/modules/icon-list/system/classes/icon-list-abstract.class';
import {IconModel} from 'wlc-engine/modules/icon-list/system/models/icon-list-item.model';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ColorThemeService} from 'wlc-engine/modules/core';
import * as Params from './icon-safety-list.params';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-icon-safety-list]',
    templateUrl: './icon-safety-list.component.html',
})
export class IconSafetyListComponent extends IconListAbstract<Params.IIconSafetyListCParams> implements OnInit {
    @Input() protected inlineParams: Params.IIconSafetyListCParams;

    public items: IconModel[] = [];
    public $params: Params.IIconSafetyListCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IIconSafetyListCParams,
        protected configService: ConfigService,
        protected colorThemeService: ColorThemeService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, colorThemeService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.items = this.getConvertedCustomList({component: 'IconListComponent', method: 'setCustomList'});
    }
}
