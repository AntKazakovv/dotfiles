import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {IIconParams} from 'wlc-engine/modules/core/system/models/icon-list-item.model';

export type ListType = 'merchants' | 'payments' | 'custom';
export type ListTheme = 'default' | 'svg';
export type IconsColor = 'default' | 'white' | 'black' | 'gray' | 'colored';

export interface IIconListComponentParams extends IComponentParams<ListTheme, ListType, string> {
    common?: {
        iconsColor?: IconsColor;
        payment?: {
            include?: string[],
            exclude?: string[],
        },
    }
    items?: IIconParams[];
}

export const defaultParams: IIconListComponentParams = {
    class: 'wlc-icon-list',
    common: {
        iconsColor: 'white',
    },
};


// TODO delete after service
export interface IPayment {
    Alias: {
        [key: string]: string;
    };
    Init: string;
    Name: string;
}
