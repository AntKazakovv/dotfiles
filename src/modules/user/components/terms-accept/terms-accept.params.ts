import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export interface ITermsAcceptCParams extends IComponentParams<string, string, string> {
    source: 'router' | 'userinfo';
}

export const defaultParams: ITermsAcceptCParams = {
    class: 'wlc-accept-terms',
    source: 'userinfo',
};
