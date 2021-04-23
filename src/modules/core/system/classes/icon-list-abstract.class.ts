import {RawParams} from '@uirouter/core';

import {
    AbstractComponent,
    ConfigService,
    GlobalHelper,
    IMixedParams,
} from 'wlc-engine/modules/core';
import {
    IconModel,
    IIconParams,
} from 'wlc-engine/modules/core/system/models/icon-list-item.model';

import _map from 'lodash-es/map';

export interface IMerchantsPaymentsIterator {
    showAs: 'svg' | 'img',
    wlcElement: string,
    nameForPath: string,
    alt?: string,
    sref?: string,
    srefParams?: RawParams,
    title?: string,
}

enum ThemeToDirectory {
    payments = 'paysystems/V2/svg',
    merchants = 'merchants/svg',
};

export abstract class IconListAbstract<T> extends AbstractComponent {

    public items: IconModel[];

    constructor(
        protected componentParams: IMixedParams<T>,
        protected configService: ConfigService,
    ) {
        super(componentParams, configService);
    }

    /**
     * Set items collection
     * @param items - collection of items
     * @param iterator - handler which returns IIconParams
     */
    protected setItemsList<I>(items: I[], iterator: (item: I) => IIconParams): void {
        this.items = _map<I, IconModel>(items, (item: I): IconModel => {
            return new IconModel(iterator(item));
        });
    }

    /**
     * Iterator function for merchants and payments
     * @param pathDirectory - merchants or payments
     * @param params - object with parameters for creating IIconParams
     * @returns IIconParams
     */
    protected merchantsPaymentsIterator(pathDirectory: string, params: IMerchantsPaymentsIterator): IIconParams {
        const {showAs, wlcElement, nameForPath, alt, sref, srefParams, title} = params;
        return {
            showAs: showAs,
            iconUrl: this.getPath(nameForPath, pathDirectory, showAs),
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
     * @returns The path to image.
     */
    protected getPath(name: string, pathDirectory: string, showAs: 'svg' | string): string {
        const rootPath = showAs === 'svg' ? '' : '/gstatic';
        const color = showAs === 'svg' ? 'black' : 'color';

        return `${rootPath}/${ThemeToDirectory[pathDirectory]}/${color}/${GlobalHelper.toSnakeCase(name)}.svg`;
    }

    protected wlcElementTail(name: string): string {
        return name.toLowerCase().replace(/\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    }

}
