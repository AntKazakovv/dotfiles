import {TModuleName} from 'wlc-engine/modules/core/system/constants/modules.constants';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export const wolfConfig: Partial<Record<TModuleName, IIndexing<IIndexing<unknown>>>> = {
    'core': {
        'wlc-info-page': {
            theme: 'wolf',
        },
    },
};
