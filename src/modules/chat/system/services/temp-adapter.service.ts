import {Injectable} from '@angular/core';
import {
    BehaviorSubject,
    map,
    Observable,
    filter,
} from 'rxjs';

import {
    ConfigService,
    DataService,
    EventService,
    IData,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    IAddProfileInfoCParams,
    UserProfile,
} from 'wlc-engine/modules/user';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {TUseAsNickname} from './../config/chat.config';

export interface IChatCredentials {
    login: string;
    password: string;
}

interface IChatNickname {
    nickname: string;
}

@Injectable({providedIn: 'root'})
export class TempAdapterService {
    public isAuth$: BehaviorSubject<boolean> = new BehaviorSubject(
        this.configService.get<boolean>('$user.isAuthenticated'),
    );

    public userProfile$: BehaviorSubject<UserProfile> = this.configService
        .get<BehaviorSubject<UserProfile>>('$user.userProfile$');

    private _login$: BehaviorSubject<string> = new BehaviorSubject(null);

    public readonly nicknameType: TUseAsNickname = this.configService.get<TUseAsNickname>('$chat.useAsNickname');

    public login$: Observable<string> = this._login$.pipe(filter(v => v !== null));


    constructor(
        protected configService: ConfigService,
        protected eventService: EventService,
        protected dataService: DataService,
        protected modalService: ModalService,
    ) {
        this.init();
    }

    public async getCredentials(): Promise<IChatCredentials> {
        try {
            return (await this.dataService.request<IData<IChatCredentials>>({
                name: 'store',
                system: 'chat',
                url: '/chat/password',
                type: 'GET',
            })).data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(
                '%c error',
                'background: black; color: chartreuse; font-size: 14px',
                error);
            throw error;
        }
    }

    public async getNickname(): Promise<void> {
        try {
            const response: IData<IChatNickname> = await this.dataService.request<IData<IChatNickname>>({
                name: 'nickname',
                system: 'chat',
                url: '/chat/user/data',
                type: 'GET',
            });

            this._login$.next(response.data.nickname);
        } catch (error) {
            this._login$.next('');
            throw error;
        }
    }

    public async setNickname(nickname: string): Promise<void> {
        await this.dataService.request({
            name: 'nickname',
            system: 'chat',
            url: '/chat/user/data',
            type: 'POST', // PUT for update
        }, {nickname});
    }

    public async signInAction(): Promise<string> {
        this.eventService.emit({name: 'SHOW_MODAL', data: 'login'});
        return await this.modalService.getActiveModal('login')?.ref.instance.closed;
    }

    public async addLoginAction(): Promise<void> {
        const modal = await this.modalService.showModal({
            id: 'add-profile-info',
            modifier: 'add-profile-info',
            componentName: 'user.wlc-add-profile-info',
            componentParams: <IAddProfileInfoCParams>{
                title: gettext('Add username'),
                formConfig: {
                    class: 'wlc-form-wrapper',
                    components: [
                        FormElements.login,
                        FormElements.password,
                        FormElements.submit,
                    ],
                },
            },
            showFooter: false,
            backdrop: true,
        });

        await modal.closed;
    }

    protected init(): void {

        if (this.nicknameType === 'login') {
            this.login$ = this.configService
                .get<BehaviorSubject<UserProfile>>('$user.userProfile$')
                .pipe(
                    filter(v => !!v?.idUser),
                    map(v => v.login),
                );
        }

        if (this.isAuth$.getValue() && this.nicknameType === 'chatNickname') {
            this.getNickname().catch(() => {
                // avoid console error
            });
        }

        this.eventService.subscribe({name: 'LOGIN'}, () => {
            if (this.nicknameType === 'chatNickname') {
                this.getNickname().catch(() => {
                    // avoid console error
                });
            }

            this.isAuth$.next(true);
        });

        this.eventService.subscribe({name: 'LOGOUT'}, () => {
            if (this.nicknameType === 'chatNickname') {
                this._login$.next(null);
            }

            this.isAuth$.next(false);
        });
    }
}
