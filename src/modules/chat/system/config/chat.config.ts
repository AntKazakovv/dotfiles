import {IRoom} from 'wlc-engine/modules/chat/system/interfaces';

export interface IChatConfig {
    /**
     * prosody domains
     */
    domains?: {
        /**
         * By default - `qa-prosody.egamings.com` - common for all projects in qa environment
         */
        qa?: string;
        /**
         * By default - `test-prosody.egamings.com` - common for all projects in test environment
         */
        test?: string;
        /**
         * No default value, must be set in the project
         */
        prod?: string;
    };
    /**
     * By default only one room exists
     *
     * TODO multiple rooms is objective for second stream
     */
    rooms?: IRoom[];
    /**
     * By default is `$base.site.name` in lower case
     */
    roomKeyPrefix?: string;
    /**
     * TODO: temp emoji list, external library in the future
     */
    emojiList?: Map<string, string>;
    /**
     * See [[TUseAsNickname]]
     */
    useAsNickname?: TUseAsNickname;
}

/**
 * Nickname type:
 * `login` - use field login of user profile. If login is empty, asks to fill it via add-info form.
 * `chatNickname` - use special chat endpoint to create uniq nickname.
 */
export type TUseAsNickname = 'login'
    | 'chatNickname';

export const chatConfig: IChatConfig = {
    useAsNickname: 'chatNickname',
    domains: {
        qa: 'qa-prosody.egamings.com',
        test: 'test-prosody.egamings.com',
    },
    rooms: [
        {
            key: 'general',
            value: 'General',
            imgKey: 'gb',
        },
    ],
    emojiList: new Map<string, string>([
        ['smiling_face_with_smiling_eyes', '😊'],
        ['grinning_face_with_smiling_eyes', '😁'],
        ['winking_face', '😉'],
        ['smiling_face_with_sunglasses', '😎'],
        ['smiling_face_with_open_mouth_and_cold_sweat', '😅'],
        ['face_with_stuck_out_tongue_and_winking_eye', '😜'],
        ['thinking_face', '🤔'],
        ['weary_face', '😩'],
        ['face_with_tears_of_joy', '😂'],
        ['loudly_crying_face', '😭'],
        ['smiling_face_with_heart_shaped_eyes', '😍'],
        ['orange_heart', '🧡'],
        ['fire', '🔥'],
        ['face_screaming_in_fear', '😱'],
        ['victory_hand', '✌'],
        ['four_leaf_clover', '🍀'],
        ['ok_hand_sign', '👌'],
        ['pile_of_poo', '💩'],
        ['game_dice', '🎲'],
        ['slot_machine', '🎰'],
        ['woman_beard', '🧔‍♀️'],
    ]),
};
