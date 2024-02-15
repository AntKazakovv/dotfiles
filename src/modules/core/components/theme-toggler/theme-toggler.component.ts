import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';

import {
    Observable,
    takeUntil,
} from 'rxjs';
import _isUndefined from 'lodash-es/isUndefined';

import {
    AbstractComponent,
    ActionService,
    ConfigService,
    DeviceType,
} from 'wlc-engine/modules/core';
import {ColorThemeService} from 'wlc-engine/modules/core/system/services/color-theme/color-theme.service';
import {TColorTheme} from 'wlc-engine/modules/core/system/interfaces/base-config/color-theme-switching.config';
import {TFixedPanelStore} from 'wlc-engine/modules/core/system/interfaces/base-config/fixed-panel.interface';

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

    public override $params: Params.IThemeTogglerCParams;
    public status: boolean;
    public leftIcon: string;
    public rightIcon: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IThemeTogglerCParams,
        configService: ConfigService,
        protected colorThemeService: ColorThemeService,
        protected actionService: ActionService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.colorThemeService.appColorTheme$.pipe(takeUntil(this.$destroy)).subscribe((theme: TColorTheme) => {
            this.status = theme === 'alt';
            this.cdr.markForCheck();
        });

        this.leftIcon = this.$params.theme === 'alternative'
            ? '/wlc/icons/dark.svg' : '/wlc/icons/theme-toggler-default.svg';
        this.rightIcon = this.$params.theme === 'alternative'
            ? '/wlc/icons/light.svg' : '/wlc/icons/theme-toggler-alt.svg';

        if (this.$params.type === 'inverse') {
            this.leftIcon = this.$params.theme === 'alternative'
                ? '/wlc/icons/light.svg' : '/wlc/icons/theme-toggler-alt.svg';
            this.rightIcon = this.$params.theme === 'alternative'
                ? '/wlc/icons/dark.svg' : '/wlc/icons/theme-toggler-default.svg';
        }

        this.configService.get<Observable<[DeviceType, TFixedPanelStore]>>('changesFixedPanel$')
            ?.pipe(takeUntil(this.$destroy))
            .subscribe((value: [DeviceType, TFixedPanelStore]) => {
                const isMobile = value[0] !== DeviceType.Desktop;
                const isCompact: boolean = value[1]['left'] === 'compact';

                this.$params.compactMod = isCompact ? isCompact && !isMobile : isCompact;

                if (isCompact && !isMobile) {
                    this.addModifiers('compact');
                } else {
                    this.removeModifiers('compact');
                }

                this.cdr.markForCheck();
            });
    }

    /**
     * It is fired by click on the toggler and emits change color theme event
     */
    public toggleThemeHandler(status?: TColorTheme): void {
        if(!_isUndefined(status)) {

            if (this.status && status === 'alt' || !this.status && status === 'default') {
                return;
            }
            this.status = !this.status;
        }
        this.colorThemeService.toggleColorTheme(true, status);
    }
}
