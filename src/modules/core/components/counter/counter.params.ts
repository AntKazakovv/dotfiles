import {IComponentParams, ICounterType} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export interface ICounterCParams extends IComponentParams<string, string, string> {
    counter?: ICounterType;
}

export const defaultParams: ICounterCParams = {
    class: 'wlc-counter',
};
