import {
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';

import * as Params from './social-icons.params';

import _merge from 'lodash-es/merge';
import _sortBy from 'lodash-es/sortBy';

@Component({
    selector: '[wlc-social-icons]',
    templateUrl: './social-icons.component.html',
    styleUrls: ['./styles/social-icons.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialIconsComponent extends AbstractComponent implements OnInit {
    public $params: Params.ISocialIconsCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISocialIconsCParams,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        _merge(this.$params.socials, this.configService.get<Params.ISocialItem[]>('$base.contacts.socials') || []);
        this.$params.socials = _sortBy(this.$params.socials, (item) => item.order);
    }

    public getIconPath(item: Params.ISocialItem): string {
        return this.$params.iconPath + item.name.toLowerCase() + '.svg';
    }
}
