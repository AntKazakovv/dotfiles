import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export interface IIconCParams extends IComponentParams<string, string, string> {
}

export const defaultParams: IIconCParams = {
    class: 'wlc-icon',
};
