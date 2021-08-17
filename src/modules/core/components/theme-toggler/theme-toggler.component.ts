import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';

import * as Params from './theme-toggler.params';

/**
 * Theme color switching functionality is turning on in $base config
 * export const $base: IBaseConfig = {
 *      ...
 *      colorThemeSwitching: {
 *          use: true,
 *          altName: 'alt',
 *      },
 *      ...
 * };
 */
@Component({
    selector: '[wlc-theme-toggler]',
    templateUrl: './theme-toggler.component.html',
    styleUrls: ['./styles/theme-toggler.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ThemeTogglerComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IThemeTogglerCParams;

    public $params: Params.IThemeTogglerCParams;
    public status: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IThemeTogglerCParams,
        protected configService: ConfigService,
        protected eventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.status = !!this.configService.get<string>('colorTheme');
    }

    public toggleThemeHandler(): void {
        this.eventService.emit({
            name: 'THEME_CHANGE',
            data: this.status,
        });
    }

}
