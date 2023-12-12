import {
    ChangeDetectorRef,
    Directive,
} from '@angular/core';
import {RawParams} from '@uirouter/core';

import {takeUntil} from 'rxjs';

import {
    AbstractComponent,
    ConfigService,
    GlobalHelper,
    IMixedParams,
    IFromLog,
    ColorThemeService,
} from 'wlc-engine/modules/core';
import {ColorThemeValues} from 'wlc-engine/modules/core/constants';
import {
    IconHelper,
} from 'wlc-engine/modules/core/system/helpers/icon.helper';
import {
    TIconsType,
    TIconShowAs,
    TIconColorBg,
} from 'wlc-engine/modules/core/system/interfaces/core.interface';
import {TColorTheme} from 'wlc-engine/modules/core/system/interfaces/base-config/color-theme-switching.config';
import {
    IconModel,
    IIconParams,
} from 'wlc-engine/modules/icon-list/system/models/icon-list-item.model';
import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces';
import {ThemeToDirectory} from 'wlc-engine/modules/core/system/config/base/icons.config';

import _map from 'lodash-es/map';

export interface IItemsCommonLinkParams {
    /** Inside link. Only one parameter available `sref` or `href` */
    sref?: string;
    /** Params for sref */
    srefParams?: RawParams;
    /** Outside link. Only one parameter available `sref` or `href`. */
    href?: string;
}

export interface IMerchantsPaymentsIterator extends IItemsCommonLinkParams {
    showAs: TIconShowAs,
    wlcElement: string,
    nameForPath: string,
    alt?: string,
    title?: string,
    colorIconBg?: TIconColorBg;
}

export interface IAbstractIconsListParams<T, R, M> extends IComponentParams<T, R, M> {
    /** Apply one of two types of colored icons (works only with colored) */
    colorIconBg?: TIconColorBg,
    /**
     * Apply colored icons(they will be parsed as img), and black icons will be shown as svg
     */
    iconsType?: TIconsType,
    /** common params to list items */
    itemsCommonLinkParams?: IItemsCommonLinkParams,
    /**
    * Array for custom icons
    *
    * @example
    * items: [
    *      {
    *          showAs: 'img',
    *          iconUrl: '/static/images/payments/MCSecureCode.svg',
    *      },
    *      {
    *          showAs: 'img',
    *          iconUrl: '/static/images/payments/VerifiedByVisa .svg',
    *      },
    * ]
    */
    items?: IIconParams[],
}

@Directive()
export abstract class IconListAbstract<T> extends AbstractComponent {
    public override $params: IAbstractIconsListParams<unknown, unknown, unknown>;

    constructor(
        protected componentParams: IMixedParams<T>,
        configService: ConfigService,
        protected colorThemeService: ColorThemeService,
        cdr?: ChangeDetectorRef,
    ) {
        super(componentParams, configService, cdr);
    }

    /**
     * Convert items collection to icon model
     * @param items - collection of items
     * @param iterator - handler which returns IIconParams
     */
    protected convertItemsToIconModel<I>(
        items: I[], iterator: (item: I) => {from: IFromLog, icon: IIconParams},
    ): IconModel[] {
        return _map<I, IconModel>(items, (item: I): IconModel => {
            const {from, icon} = iterator(item);
            return new IconModel(from, icon);
        });
    }

    /**
     * Iterator function for merchants and payments
     * @param pathDirectory - merchants or payments
     * @param params - object with parameters for creating IIconParams
     * @returns IIconParams
     */
    protected merchantsPaymentsIterator(pathDirectory: keyof typeof ThemeToDirectory,
        params: IMerchantsPaymentsIterator,
    ): IIconParams {
        const {showAs, wlcElement, nameForPath, alt, sref, srefParams, href, title, colorIconBg} = params;
        return {
            showAs: showAs,
            iconUrl: this.getPath(nameForPath, pathDirectory, showAs, colorIconBg),
            alt: alt ? alt : nameForPath,
            modifier: this.getItemModifier(GlobalHelper.toSnakeCase(nameForPath)),
            wlcElement: wlcElement,
            sref: sref || null,
            srefParams: srefParams || null,
            href: href || null,
            title: title || null,
        };
    }

    /**
     * Creates modifier for thee item.
     * @param {string} mod - The item modifier
     * @returns The class-modifier for the item.
     */
    protected getItemModifier(mod: string): string {
        return mod ? `${this.$class}__item--${mod.replace(' ', '-')}` : '';
    }

    /**
     * Creates path to paysystem or merchant images.
     * @param {string} name - Name of paysystem or alias of merchant
     * @param pathDirectory
     * @param showAs
     * @param colorIconBg
     * @returns The path to image.
     */
    protected getPath(
        name: string, pathDirectory: string, showAs: TIconShowAs, colorIconBg?: TIconColorBg,
    ): string {
        return IconHelper.getIconPath(
            name,
            pathDirectory,
            showAs,
            colorIconBg,
        );
    }

    protected wlcElementTail(name: string): string {
        return name.toLowerCase().replace(/\s/g, '-').replace(/[^\dA-Za-z-]/g, '');
    }

    /** On change color site theme method changes icons on another color from gstatic
     * Wont work with custom list which creates from "items" params
     **/
    protected subscribeOnToggleSiteTheme(themeChangeCallback: Function): void {
        const defaultColorIconBg = this.$params.colorIconBg;

        if (!!this.configService.get<string>(ColorThemeValues.configName)) {
            this.$params.colorIconBg = this.getColorThemeBgType(defaultColorIconBg);
        }

        this.colorThemeService.appColorTheme$.pipe(takeUntil(this.$destroy)).subscribe((theme: TColorTheme) => {
            this.$params.colorIconBg = this.getColorThemeBgType(defaultColorIconBg, theme);
            themeChangeCallback();
        });
    }

    protected getColorThemeBgType(defaultIconsColor: TIconColorBg, theme: TColorTheme = 'default'): TIconColorBg {
        return IconHelper.getColorThemeBgType(defaultIconsColor, theme !== 'default');
    }

    /**
     * @returns {IconModel[]}
     * create and return iconmodel based on items from params
     **/
    protected getConvertedCustomList(from: IFromLog): IconModel[] {
        return this.convertItemsToIconModel<IIconParams>(
            this.$params.items,
            (item) => {
                return {
                    icon: item,
                    from,
                };
            },
        );
    }
}
