import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace  signInPageSection {

    export const kiosk: ILayoutSectionConfig = {
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-sign-in-page__wrapper',
                    components: [
                        componentLib.wlcLogo.header,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-sign-in-page__form-wrapper',
                                components: [
                                    componentLib.wlcSignInPageForm.kiosk,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };
}
