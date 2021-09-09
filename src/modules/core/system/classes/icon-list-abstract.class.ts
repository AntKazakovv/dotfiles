import {RawParams} from '@uirouter/core';

import {
    AbstractComponent,
    ConfigService,
    GlobalHelper,
    IMixedParams,
    IFromLog,
    IIconListCParams,
    IPaysystem,
} from 'wlc-engine/modules/core';
import {
    IconModel,
    IIconParams,
} from 'wlc-engine/modules/core/system/models/icon-list-item.model';
import {MerchantModel} from 'wlc-engine/modules/games';

import _map from 'lodash-es/map';

export type ColorIconBgType = 'dark' | 'light';
export type TIconShowAs = 'svg' | 'img';
export type TypeComponent = 'payments' | 'merchants';

export interface IMerchantsPaymentsIterator {
    showAs: TIconShowAs,
    wlcElement: string,
    nameForPath: string,
    alt?: string,
    sref?: string,
    srefParams?: RawParams,
    title?: string,
    colorIconBg?: ColorIconBgType;
}

enum ThemeToDirectory {
    payments = 'paysystems/V2/svg',
    merchants = 'merchants/svg',
};

export abstract class IconListAbstract<T> extends AbstractComponent {

    constructor(
        protected componentParams: IMixedParams<T>,
        protected configService: ConfigService,
    ) {
        super(componentParams, configService);
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
    protected merchantsPaymentsIterator(pathDirectory: string, params: IMerchantsPaymentsIterator): IIconParams {
        const {showAs, wlcElement, nameForPath, alt, sref, srefParams, title, colorIconBg} = params;
        return {
            showAs: showAs,
            iconUrl: this.getPath(nameForPath, pathDirectory, showAs, colorIconBg),
            alt: alt ? alt : nameForPath,
            modifier: this.getItemModifier(GlobalHelper.toSnakeCase(nameForPath)),
            wlcElement: wlcElement,
            sref: sref || null,
            srefParams: srefParams || null,
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
        name: string, pathDirectory: string, showAs: 'svg' | string, colorIconBg?: ColorIconBgType,
    ): string {
        const rootPath = showAs === 'svg' ? '' : '/gstatic';
        const color = showAs === 'svg' ? 'black' : 'color';
        const colorBg = (color === 'color' && colorIconBg) ? 'color/' + colorIconBg : null;

        return `${rootPath}/${ThemeToDirectory[pathDirectory]}/${colorBg || color}/${GlobalHelper
            .toSnakeCase(name)}.svg`;
    }

    protected wlcElementTail(name: string): string {
        return name.toLowerCase().replace(/\s/g, '-').replace(/[^\dA-Za-z-]/g, '');
    }

    /**
     * Prepare icon data
     *
     * @param componentType
     * @param params
     * @param source
     * @returns {IIconParams[]}
     **/
    protected prepareIconsParams(
        componentType: TypeComponent,
        params: IIconListCParams,
        source: unknown[]): IIconParams[] {
        const {theme, type = 'img', colorIconBg} = params;

        if (componentType === 'merchants') {
            return _map(source, (item: MerchantModel) => {
                return this.merchantsPaymentsIterator(theme, {
                    showAs: type as TIconShowAs,
                    wlcElement: item.wlcElement,
                    nameForPath: item.alias,
                    colorIconBg,
                    alt: item.name,
                });
            });
        } else {
            return _map(source, (item: IPaysystem) => {
                return this.merchantsPaymentsIterator(theme, {
                    showAs: type as TIconShowAs,
                    wlcElement: 'block_payment-' + this.wlcElementTail(item.Name),
                    nameForPath: item.Name,
                    colorIconBg,
                });
            });
        }
    }

}
