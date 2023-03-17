import {DOCUMENT} from '@angular/common';
import {
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    Inject,
    Injectable,
    Injector,
} from '@angular/core';
import {
    BehaviorSubject,
    distinctUntilChanged,
    EMPTY,
    first,
    firstValueFrom,
    Observable,
    of ,
    Subject,
    switchMap,
    takeWhile,
    tap,
} from 'rxjs';
import {jid as parseJid} from '@xmpp/client';
import {JID} from '@xmpp/jid';

import {ChatPanelComponent} from 'wlc-engine/modules/chat/components/chat-panel/chat-panel.component';
import {
    mucUserNs,
    tempUser,
} from 'wlc-engine/modules/chat/system/constants/core.constants';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {XMPPAdapterService} from 'wlc-engine/modules/chat/system/services/xmpp-adapter.service';
import {RoomModel} from 'wlc-engine/modules/chat/system/classes/room.model';
import {ChatConfigService} from 'wlc-engine/modules/chat/system/services/chat-config.service';
import {NicknameFormComponent} from
    'wlc-engine/modules/chat/components/chat-panel/components/nickname-form/nickname-form.component';
import {DialogService} from 'wlc-engine/modules/chat/system/services/dialog.service';
import {IChatCredentials} from './temp-adapter.service';
import {TempAdapterService} from 'wlc-engine/modules/chat/system/services/temp-adapter.service';
import {Direction, IMessage, IStanza} from './../interfaces/index';

export interface IContact {
    nickname: string;
    role: string;
    jid?: JID;
    [key: string]: any;
}

export type TConnectionStatus = 'disconnected' | 'connected' | 'failed';

@Injectable({providedIn: 'root'})
export class ChatService {
    public readonly roomList: RoomModel[] = [];
    protected rooms: Map<string, RoomModel> = new Map([]);
    protected mainRoom: string = '';

    protected panelRef: ComponentRef<ChatPanelComponent>;
    protected isChatOpened$: BehaviorSubject<boolean> = new BehaviorSubject(
        this.config.base.initOptions.startsWithOpen);
    protected activeRoom$: BehaviorSubject<RoomModel> = new BehaviorSubject(null);

    protected roomConnected$: BehaviorSubject<TConnectionStatus> = new BehaviorSubject('disconnected');
    protected nickname: string | null = null;
    protected userData: IContact = {
        nickname: '',
        role: '',
    };

    protected selfOId: Set<string> = new Set([]);
    protected userChanged$: Subject<any> = new Subject();
    protected chatStatus$: BehaviorSubject<'connecting' | null> = new BehaviorSubject(null);

    constructor (
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) protected window: Window,
        private appRef: ApplicationRef,
        // https://github.com/angular/angular/issues/45263#issuecomment-1082530357
        private cfr: ComponentFactoryResolver,
        private injector: Injector,
        private tas: TempAdapterService,
        private xmppService: XMPPAdapterService,
        private config: ChatConfigService,
        private dialog: DialogService,
    ) {
        this.init();
    }

    /**
     * Open chat panel
     */
    public openChat(): void {
        this.isChatOpened$.next(true);
    }

    /**
     * close chat panel
     */
    public closeChat(): void {
        this.isChatOpened$.next(false);
    }

    public get currentNickname(): string | null {
        return this.nickname;
    }

    public get isChatOpened(): boolean {
        return this.isChatOpened$.getValue();
    }

    public get isChatOpenedObserver$(): Observable<boolean> {
        return this.isChatOpened$.asObservable();
    }

    public get activeRoom(): RoomModel {
        return this.activeRoom$.getValue();
    }

    public get activeRoomStr$(): Observable<RoomModel> {
        return this.activeRoom$.asObservable();
    }

    public get selfContact(): IContact {
        return this.userData;
    }

    public get connectChat$(): BehaviorSubject<TConnectionStatus> {
        return this.roomConnected$;
    }

    public get userChangedStream$(): Observable<any> {
        return this.userChanged$.asObservable();
    }

    /**
     * Emits main app sign in action and close chat
     */
    public signInAction(): void {
        this.closeChat();
        this.tas.signInAction().then(() => {
            if (this.tas.isAuth$.getValue()) {
                this.openChat();
            }
        });
    }

    /**
     * Emit adding login action depends on settings
     */
    public async addLoginAction(): Promise<void> {
        if (this.tas.nicknameType === 'login') {
            this.closeChat();
            await this.tas.addLoginAction();

            if (this.nickname) {
                this.roomConnected$.next('disconnected');
                this.openChat();
            }
        } else {
            await firstValueFrom(this.dialog.show('add-nickname', {
                showFooter: false,
                showClose: true,
                closeByBackdrop: false,
                headerText: gettext('Enter chat nickname:'),
                component: NicknameFormComponent,
                componentParams: {
                    onSuccess: () => {
                        this.roomConnected$.next('disconnected');
                    },
                },
            }).status$.pipe(first(v => v === 'hidden')));
        }
    }

    /**
     * Send message to room from current active user
     * @param message text
     */
    public sendMsgToRoom(message: string): void {
        this.xmppService.send(this.activeRoom.address, message);
    }

    /**
     * If no arguments - main room
     * @param key room key/id
     */
    public setActiveRoom(key?: string): void {
        this.activeRoomDisconnect(`User moved to ${key || this.mainRoom}`);
        this.activeRoom$.next(this.rooms.get(key) || this.rooms.get(this.mainRoom));
        this.activeRoom.connect();
    }

    /**
     * Connect active room if it was disconnected in any reason
     */
    public async connectRoom(): Promise<void> {
        if (this.roomConnected$.getValue()) {
            this.roomConnected$.next('disconnected');
        }
        await this.xmppService.roomEnter(this.activeRoom.address, this.nickname);
    }

    /**
     * Leave active room
     * @param msg reason to leave
     */
    protected activeRoomDisconnect(msg: string = ''): void {
        if (this.activeRoom) {
            this.xmppService.roomExit(this.activeRoom.address, this.nickname, msg);
            this.activeRoom.disconnect();
        }
    }

    /**
     * Service init method
     */
    protected async init(): Promise<void> {

        this.prepareRooms();
        this.setActiveRoom();

        this.subscribeStanzaStream();
        this.subscribeClientStatus();
        this.subscribeIsAuthStatus();

        setTimeout(() => {
            if (!this.panelRef) {
                this.attachPanel();
            }
        }, 0);
    }

    /**
     * Subscribes to main stanza stream
     */
    protected subscribeStanzaStream(): void {
        this.xmppService.stanzaStream$.subscribe((stanza: IStanza): void => {
            this.processStanza(stanza);
        });
    }

    /**
     * Subscribes to XMPP client status stream
     */
    protected subscribeClientStatus(): void {
        this.xmppService.clientStatus$
            .pipe(
                tap((status) => this.tapClientStatusSubscription(status)),
                switchMap((status) => status === 'online' ? this.activeRoom$ : EMPTY),
            )
            .subscribe(() => {
                this.connectRoom();
            });
    }

    /**
     * Updates chat statuses on client status change
     */
    protected tapClientStatusSubscription(status: string): void {
        if (status === 'failed') {
            this.userChanged$.next('failed');
            this.roomConnected$.next('failed');
        } else if (status === 'online') {
            this.userChanged$.next(null);
        }
    }

    /**
     * Subscribes to isAuth user status
     */
    protected subscribeIsAuthStatus(): void {
        this.tas.isAuth$
            .pipe(switchMap((isAuth: boolean) => {
                this.roomConnected$.next('disconnected');

                return isAuth ? this.tas.login$.pipe(
                    distinctUntilChanged(),
                    takeWhile(v => !v, true),
                ) : of(null);
            }))
            .subscribe((login: string | null): void => {
                this.authProcess(login);
            });
    }

    /**
     * Process auth. Reconnect client on change (login/logout) user
     * @param login
     */
    protected async authProcess(login: string | null): Promise<void> {
        this.nickname = login;

        if (this.tas.isAuth$.getValue() && this.nickname) {
            this.chatStatus$.next('connecting');
            const userData: IChatCredentials = await this.tas.getCredentials();
            this.initClient(userData.login, userData.password);
        } else {
            this.selfOId.clear();
            this.initClient(tempUser.username, tempUser.password);
        }
    }

    /**
     * Creates room models
     */
    protected prepareRooms(): void {
        for (const room of this.config.rooms) {
            const roomMod = new RoomModel(
                room.key,
                room.value,
                room.imgKey,
                room.address,
            );
            this.rooms.set(room.key, roomMod);
            this.roomList.push(roomMod);

            this.mainRoom = this.roomList[0].id;
        }
    }

    /**
     * Init XMPP client with user data
     * @param username specific login got by request
     * @param password one-time password got by request
     */
    protected async initClient(username: string, password: string): Promise<void> {
        if (username === tempUser.username && username === this.xmppService.userJid?.local) {
            this.roomConnected$.next('connected');
            return;
        }

        if (this.xmppService.client) {
            await this.xmppService.logout();
            this.userData.nickname = '';
            this.userData.role = '';
            this.userData.status = null;
        }

        await this.xmppService.authClient(username, password);
    }

    /**
     * Attach panel with chat to document body
     */
    protected attachPanel(): void {
        const chatInjector = Injector.create({
            providers: [{provide: 'injectParams', useValue: 'boo'}],
            parent: this.injector,
        });

        this.panelRef = this.cfr
            .resolveComponentFactory(ChatPanelComponent)
            .create(chatInjector);

        this.appRef.attachView(this.panelRef.hostView);
        this.document.body.appendChild(this.panelRef.location.nativeElement);
    }

    /**
     * Stream handler to process stanza
     * @param stanza ws message data
     */
    protected processStanza(stanza: IStanza): void {
        // enter chat error
        if (stanza.is('presence') && stanza.getChild('error')) {
            this.errorPresenceHandler(stanza);
            return;
        }

        // presence user
        if (stanza.is('presence') && stanza.getChild('x', mucUserNs)) {
            this.presenceHandler(stanza);
            return;
        }

        // chat message
        if (stanza.is('message') && stanza.attrs.type === 'groupchat') {
            this.messageHandler(stanza);
        }
    }

    /**
     * Handle stanza with chat message
     * @param stanza ws message data
     */
    protected messageHandler(stanza: IStanza): void {
        // chat topic comes after history loaded
        if (stanza.getChild('subject')) {
            this.roomConnected$.next('connected');
            return;
        }

        // chat message data
        const delayEl = stanza.getChild('delay');
        const from = parseJid(stanza.attrs.from);
        const ocId = stanza.getChild('occupant-id').attrs.id;
        const body = stanza.getChildText('body')?.trim();
        const mucUser = stanza.getChild('x', mucUserNs)?.getChild('item');
        let contact: IContact;

        if (!this.rooms.get(from.local)?.contacts.get(ocId)) {
            this.rooms.get(from.local)?.contacts.set(ocId, contact = {
                nickname: from.resource,
                role: mucUser?.attrs.role,
                jid: mucUser ? parseJid(mucUser?.attrs.jid) : null,
            });
        } else {
            contact = this.rooms.get(from.local)?.contacts.get(ocId);
        }

        if (from?.resource && body) {
            const message: IMessage = {
                ocId: ocId,
                // history has date, new messages - no
                datetime: delayEl ? new Date(delayEl?.attrs.stamp) : new Date(),
                body: body,
                direction: this.selfOId.has(ocId) ? Direction.out : Direction.in,
                id: stanza.attrs.id,
                from: contact,
                read: this.roomConnected$.getValue() !== 'connected',
            };

            this.rooms.get(from.local)?.messageStore.addMessage(message);

        }
    }

    /**
     * Handle stanza with presence
     * @param stanza ws message data
     */
    protected presenceHandler(stanza: IStanza): void {
        const mucUser = stanza.getChild('x', mucUserNs);
        // user has been kicked
        if (stanza.attrs.type === 'unavailable'
            && mucUser.getChild('status')
            && this.nickname === parseJid(stanza.attrs.from)?.resource) {

            this.userData['status'] = 'unavailable';
            this.userChanged$.next(null);
        } else {
            const nickname: string = parseJid(stanza.attrs.from)?.resource;
            const user = mucUser.getChild('item');
            const jid = user && parseJid(user.attrs.jid);
            const ocId = stanza.getChild('occupant-id')?.attrs.id;
            const from = parseJid(stanza.attrs.from);

            if (ocId) {
                this.rooms.get(from.local)?.contacts.set(ocId, {
                    nickname: nickname,
                    role: user.attrs.role,
                    jid: jid,
                });
            }

            // own user
            if (ocId && this.nickname === nickname && mucUser.getChild('status')) {
                this.userData['role'] = user.attrs.role;
                this.userData['jid'] = jid;
                this.userData['ocId'] = ocId;
                this.userData['status'] = ocId;
                this.userData['nickname'] = nickname;

                const author = user.getChild('actor')?.attrs.nick;
                const reason = user.getChild('reason')?.children;
                this.selfOId.add(ocId);
                this.userChanged$.next(author ? {author, reason} : null);
            }
        }
    }

    /**
     * Handle stanza with presence error
     * @param stanza ws message data
     */
    protected errorPresenceHandler(stanza: IStanza): void {
        const conflict = stanza.getChild('error').getChild('conflict');

        if (conflict) { // nickname already used
            // Unexpected, login field is uniq
            console.error('Nickname is not uniq =(');
        } else { // any other case
            this.roomConnected$.next('disconnected');
            console.error(stanza);
        }
    }
}
