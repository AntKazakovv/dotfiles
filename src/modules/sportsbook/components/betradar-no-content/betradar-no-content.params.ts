import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export interface IBetradarNoContentCParams extends IComponentParams<string, string, string> {

}

export const defaultParams: IBetradarNoContentCParams = {
    moduleName: 'sportsbook',
    componentName: 'wlc-betradar-no-content',
    class: 'wlc-betradar-no-content',
};
