import {ILayoutComponent} from 'wlc-engine/modules/core';
import {IQuestsTitleCParams} from 'wlc-engine/modules/quests';

export namespace wlcQuestsTitle {

    export const def: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-profile-content__top',
            components: [
                {
                    name: 'quests.wlc-quests-title',
                    params: <IQuestsTitleCParams> {
                        customMod: ['profile'],
                        wlcElement: 'header_quests',
                    },
                },
            ],
        },
    };

    export const state: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-profile-content__top',
            components: [
                {
                    name: 'quests.wlc-quests-title',
                    params: <IQuestsTitleCParams> {
                        customMod: ['profile'],
                        wlcElement: 'header_quests',
                        type: 'state',
                    },
                },
            ],
        },
    };
}
