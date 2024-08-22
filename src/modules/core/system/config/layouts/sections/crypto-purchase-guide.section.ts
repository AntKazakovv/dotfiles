import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import {IPostCParams} from 'wlc-engine/modules/static/components';

export namespace cryptoPurchaseGuidePage {
    export const def: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'static.wlc-post',
                params: <IPostCParams>{
                    slug: 'crypto-purchase-guide',
                    showTitle: true,
                    noContent: {
                        hide: true,
                    },
                },
            },
        ],
    };
}
