import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {IconListAbstract} from 'wlc-engine/modules/icon-list/system/classes/icon-list-abstract.class';
import {IconModel} from 'wlc-engine/modules/icon-list/system/models/icon-list-item.model';
import {ColorThemeService} from 'wlc-engine/modules/core';
import * as Params from './icon-safety-list.params';

@Component({
    selector: '[wlc-icon-safety-list]',
    templateUrl: './icon-safety-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSafetyListComponent extends IconListAbstract<Params.IIconSafetyListCParams> implements OnInit {
    @Input() protected inlineParams: Params.IIconSafetyListCParams;

    public items: IconModel[] = [];
    public override $params: Params.IIconSafetyListCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IIconSafetyListCParams,
        colorThemeService: ColorThemeService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, colorThemeService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.items = this.getConvertedCustomList({component: 'IconListComponent', method: 'setCustomList'});
    }
}
