import {Inject, Injectable} from '@angular/core';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {IRoom} from 'wlc-engine/modules/chat/system/interfaces';
import {moduleConfig} from '../../chat.module';

@Injectable({providedIn: 'root'})
export class ChatConfigService {
    public readonly domain: string;
    public readonly service: string;
    public readonly rooms: IRoom[];

    constructor(@Inject(WINDOW) window: Window) {
        const env = window.WLC_ENV === 'dev' ? 'qa' : window.WLC_ENV || 'prod';
        this.domain = moduleConfig.domains[env];
        this.service = `wss://${this.domain}:5281/xmpp-websocket`;
        this.rooms = moduleConfig.rooms?.map((room) => {
            if (env !== 'prod') {
                room.key = `${moduleConfig.roomKeyPrefix}-${room.key}`;
            }
            room.address = `${room.key}@rooms.${this.domain}`;
            return room;
        });
    }
}
