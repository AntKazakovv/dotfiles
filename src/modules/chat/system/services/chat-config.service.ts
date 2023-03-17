import {
    Inject,
    Injectable,
} from '@angular/core';
import _cloneDeep from 'lodash-es/cloneDeep';

import {WINDOW} from 'wlc-engine/modules/app/system';
import {IRoom} from 'wlc-engine/modules/chat/system/interfaces';
import {moduleConfig} from '../../chat.module';
import {IChatConfig} from './../config/chat.config';

@Injectable({providedIn: 'root'})
export class ChatConfigService {
    public readonly domain: string;
    public readonly service: string;
    public readonly rooms: IRoom[];
    public readonly base: IChatConfig = _cloneDeep(moduleConfig);

    constructor(@Inject(WINDOW) window: Window) {
        const env = window.WLC_ENV === 'dev' ? 'qa' : window.WLC_ENV || 'prod';
        this.domain = this.base.domains[env];
        this.service = `wss://${this.domain}/xmpp-websocket`;
        this.rooms = this.base.rooms?.map((room: IRoom): IRoom => {
            if (env !== 'prod') {
                room.key = `${this.base.roomKeyPrefix}-${room.key}`;
            }
            room.address = `${room.key}@rooms.${this.domain}`;
            return room;
        });
    }
}
