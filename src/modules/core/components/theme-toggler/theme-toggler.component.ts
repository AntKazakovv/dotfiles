import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';

import {takeUntil} from 'rxjs';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {ColorThemeService} from 'wlc-engine/modules/core/system/services/color-theme/color-theme.service';
import {TColorTheme} from 'wlc-engine/modules/core/system/interfaces/base-config/color-theme-switching.config';

import * as Params from './theme-toggler.params';

/**
 * Theme color switching functionality is turning on in $base config
 *
 * `export const $base: IBaseConfig = {
 *      ...
 *      colorThemeSwitching: {
 *          use: true,
 *          altName: 'alt',
 *      },
 *      ...
 * };`
 *
 * If your project has light theme by default, you need to specify `inverse` type for the component
 * in `04.modules.config.ts`
 *
 * `export const $modules = {
 *      ...
 *      core: {
 *          components: {
 *              'wlc-theme-toggler': {
 *                  type: 'inverse',
 *              },
 *          },
 *      },
 *      ...
 * };`
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
    public leftIcon: string;
    public rightIcon: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IThemeTogglerCParams,
        protected configService: ConfigService,
        protected colorThemeService: ColorThemeService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.colorThemeService.appColorTheme$.pipe(takeUntil(this.$destroy)).subscribe((theme: TColorTheme) => {
            this.status = theme === 'alt';
            this.cdr.markForCheck();
        });

        this.leftIcon = '/wlc/icons/theme-toggler-default.svg';
        this.rightIcon = '/wlc/icons/theme-toggler-alt.svg';

        if (this.$params.type === 'inverse') {
            this.leftIcon = '/wlc/icons/theme-toggler-alt.svg';
            this.rightIcon = '/wlc/icons/theme-toggler-default.svg';
        }
    }

    /**
     * It is fired by click on the toggler and emits change color theme event
     */
    public toggleThemeHandler(): void {
        this.colorThemeService.toggleColorTheme(true);
    }
}
