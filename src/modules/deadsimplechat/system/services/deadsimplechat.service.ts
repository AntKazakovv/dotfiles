import {DOCUMENT} from '@angular/common';
import {
    Inject,
    Injectable,
    Injector,
} from '@angular/core';
import {
    EventService,
    ConfigService,
    DataService,
} from 'wlc-engine/modules/core';

import {WINDOW} from 'wlc-engine/modules/app/system';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';

export interface IUserResponse {
    accessToken?: string;
    userId?: string;
    username?: string;
}

export interface IRoomResponse {
    defaultNotificationEnabled?: boolean;
    enableChannels?: boolean;
    enableLikeMessage?: boolean;
    enableOneToOneChat?: boolean;
    fileSharingMode?: boolean;
    moderatorOnlyOneToOneChat?: boolean;
    name?: string;
    passwordProtected?: boolean;
    preModeratedChatRoom?: any;
    roomId?: string;
    roomPassword?: string;
    showNotificationForAllChannels?: boolean;
}

@Injectable({providedIn: 'any'})

export class DeadsimplechatService {
    public userResponse: IUserResponse = null;
    public chatRoom: IRoomResponse;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) protected window: Window,
        protected eventService: EventService,
        protected configService: ConfigService,
        private injector: Injector,
    ) {
        this.init();
    }

    private init(): void {

        if (this.configService.get<boolean>('$user.isAuthenticated')) {
            this.getRoom();
        } else {
            this.eventService.subscribe({name: 'LOGIN'}, () => {
                this.getRoom();
            });
        }
    }

    private async getRoom(): Promise<unknown> {
        try {
            const response: IData = await this.injector.get<DataService>(DataService).request({
                name: 'chatRooms',
                system: 'chat',
                url: '/chat/rooms',
                type: 'GET',
            });
            let roomsResponse: IRoomResponse[] = JSON.parse(response.data);
            this.chatRoom = roomsResponse[0]; // TODO if many room needed
            this.loginUser();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    private async loginUser(): Promise<unknown> {
        try {
            const response: IData = await this.injector.get<DataService>(DataService).request({
                name: 'userAuthChat',
                system: 'chat',
                url: '/chat/user',
                type: 'POST',
            });
            this.userResponse = JSON.parse(response.data);
            this.eventService.emit({name: 'CHAT_USER_RESPONSE'});
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
