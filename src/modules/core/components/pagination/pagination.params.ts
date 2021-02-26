import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export interface IPaginationCParams extends IComponentParams<string, string, string> {
}

export const defaultParams: IPaginationCParams = {
    class: 'wlc-pagination',
};
