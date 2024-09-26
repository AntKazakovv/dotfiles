import {DOCUMENT} from '@angular/common';
import {
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    Inject,
    Injectable,
    Injector,
    NgZone,
} from '@angular/core';
import {
    BehaviorSubject,
    distinctUntilChanged,
    EMPTY,
    filter,
    first,
    firstValueFrom,
    fromEvent,
    map,
    merge,
    Observable,
    of ,
    skip,
    startWith,
    Subject,
    Subscription,
    switchMap,
    takeWhile,
    tap,
    timer,
} from 'rxjs';
import {jid as parseJid} from '@xmpp/client';
import {JID} from '@xmpp/jid';

import {ChatPanelComponent} from 'wlc-engine/modules/chat/components/chat-panel/chat-panel.component';
import {
    mucUserNs,
    tempUser,
} from 'wlc-engine/modules/chat/system/constants/core.constants';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {
    XMPPAdapterService,
} from 'wlc-engine/modules/chat/system/services/xmpp-adapter.service';
import {RoomModel} from 'wlc-engine/modules/chat/system/classes/room.model';
import {ChatConfigService} from 'wlc-engine/modules/chat/system/services/chat-config.service';
import {NicknameFormComponent} from
    'wlc-engine/modules/chat/components/chat-panel/components/nickname-form/nickname-form.component';
import {DialogService} from 'wlc-engine/modules/chat/system/services/dialog.service';
import {IChatCredentials} from './temp-adapter.service';
import {TempAdapterService} from 'wlc-engine/modules/chat/system/services/temp-adapter.service';
import {
    TFixedPanelPos,
} from 'wlc-engine/modules/core/system/interfaces/base-config/fixed-panel.interface';
import {
    Direction,
    INewMsg,
    IRetractMsg,
    IReplaceMsg,
    IStanza,
} from './../interfaces/index';

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
    public readonly moderatorsList: IContact[] = [];
    public readonly tabVisibility$: Observable<boolean> = fromEvent(this.document, 'visibilitychange')
        .pipe(map(() => this.document.visibilityState === 'visible'), startWith(true));
    public readonly messageFail$: Subject<void> = new Subject();
    public useInFixedPanel: boolean = false;
    protected checkCompleted: boolean = false;

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
    protected userChanged$: BehaviorSubject<any> = new BehaviorSubject(null);
    protected chatStatus$: BehaviorSubject<'connecting' | null> = new BehaviorSubject(null);
    protected fixedPanelPos: TFixedPanelPos;
    protected maxMsgCount: number = this.config.base.maxMsgCount;
    private chatStartedSub: Subscription;
    private connectedSub: Subscription;
    private tabVisibilitySub: Subscription;

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
        private zone: NgZone,
    ) {
        this.init();
    }

    /**
     * Open chat panel
     */
    public openChat(): void {
        this.initChat();

        if (this.fixedPanelPos) {
            this.tas.toggleFixedPanel(this.fixedPanelPos);
        }
    }

    /**
     * close chat panel
     */
    public closeChat(): void {
        if (this.fixedPanelPos) {
            this.tas.toggleFixedPanel(this.fixedPanelPos);
        }

        this.chatStartedSub.unsubscribe();
        this.connectedSub.unsubscribe();
        this.tabVisibilitySub.unsubscribe();
        this.isChatOpened$.next(false);
        this.xmppService.logout();
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
        if (!this.fixedPanelPos) {
            this.closeChat();
        }

        this.tas.signInAction().then(() => {
            if (this.tas.isAuth$.getValue() && !this.fixedPanelPos) {
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
    public sendMsgToRoom(message: string): Observable<boolean | 'error'> {
        return this.xmppService.send(this.activeRoom.address, message)
            .pipe(tap(v => !v && this.messageFail$.next()));
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

        const fixedPanelPosition = this.config.base.initOptions.fixedPanelPosition;

        if (!fixedPanelPosition) {
            timer(0).pipe(tap(() => {
                if (!this.panelRef) {
                    this.attachPanel();
                }
            })).subscribe();
        } else {
            this.fixedPanelPos = fixedPanelPosition;
            this.useInFixedPanel = true;

            if (this.tas.fixedPanelStore$.getValue()[fixedPanelPosition] === 'expanded') {
                this.initChat();
            }
        }
        await this.getModerators();
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
    protected async tapClientStatusSubscription(status: string): Promise<void> {

        if (status === 'failed') {
            this.userChanged$.next('failed');
            this.roomConnected$.next('failed');
        } else if (status === 'online') {
            this.userChanged$.next(null);
        }
    }

    protected subscribeVisibilityStatus(): void {
        this.zone.runOutsideAngular(() => {
            this.tabVisibilitySub = this.tabVisibility$
                .pipe(
                    skip(1),
                    filter(Boolean),
                )
                .subscribe(() => {
                    if (this.nickname) {
                        this.authProcess(this.nickname, true);
                    }
                });

            this.connectedSub = merge(
                fromEvent(this.window, 'offline'),
                this.tabVisibility$.pipe(skip(1), filter(Boolean)),
                this.messageFail$,
            ).pipe(
                tap(() => {
                    if (this.checkCompleted) {
                        this.checkCompleted = false;
                    }
                }),
                filter(() => !!this.xmppService.userJid && !this.checkCompleted),
                switchMap(() => this.checkSocket()),
                tap(() => this.checkCompleted = true),
            ).subscribe(async (connected: boolean) => {
                if (!connected) {
                    this.roomConnected$.next('disconnected');
                    this.zone.run(async () => await this.authProcess(this.nickname));
                }
                this.checkCompleted = true;
            });
        });
    }

    protected initChat(): void {
        if (this.xmppService.client && this.tas.isAuth$.getValue() && this.nickname) {
            this.chatReenter();
        } else {
            this.subscribeIsAuthStatus();
            this.subscribeVisibilityStatus();
            this.subscribeReconnectionErrors();
        }
        this.isChatOpened$.next(true);
    }

    protected checkSocket(): Observable<boolean> {
        const visible: boolean = this.document.visibilityState === 'visible';
        const online: boolean = this.window.navigator.onLine;

        if (visible && online) {
            return this.xmppService.checkPing();
        }

        if (visible && !online) {
            return fromEvent(this.window, 'online', {once: true}).pipe(
                switchMap(() => this.xmppService.checkPing()),
            );
        }

        return of(true);
    }

    /**
     * Subscribes to isAuth user status
     */
    protected subscribeIsAuthStatus(): void {
        this.chatStartedSub = this.tas.isAuth$
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

    protected subscribeReconnectionErrors(): void {
        this.xmppService.isReconError$.subscribe(() => {
            this.authProcess(this.nickname, true);
        });
    }

    /**
     * Process auth. Reconnect client on change (login/logout) user
     * @param login
     */
    protected async authProcess(login: string | null, reconnect: boolean = false): Promise<void> {
        this.nickname = login;

        if (reconnect || (this.tas.isAuth$.getValue() && this.nickname)) {
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

    protected async getModerators(): Promise<void> {

        try {
            const res = await this.tas.getUserInfo(this.activeRoom.address, 'moderator');

            for (const item of res.data) {
                const user: IContact = {
                    'nickname': item.Login,
                    'jid': item.JID,
                    'role': item.Role,
                    'ocid': item.OccupantID,
                };
                this.moderatorsList.push(user);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(
                '%c error',
                'background: black; color: chartreuse; font-size: 14px',
                error);
            throw error;
        }

    }

    /**
     * Init XMPP client with user data
     * @param username specific login got by request
     * @param password one-time password got by request
     */
    protected async initClient(username: string, password: string): Promise<void> {
        if (this.xmppService.client) {
            if (this.xmppService.client?.status !== 'offline') {
                await this.xmppService.logout();
            }
            this.userData.nickname = '';
            this.userData.role = '';
            this.userData.status = null;
        }

        await this.xmppService.authClient(username, password);
    }

    protected async chatReenter(): Promise<void> {
        const userData: IChatCredentials = await this.tas.getCredentials();
        await this.xmppService.authClient(userData.login, userData.password);
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
    protected async processStanza(stanza: IStanza): Promise<void> {
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
            this.xmppService.clearQueue();
            return;
        }

        // chat message data
        const ocId = stanza.getChild('occupant-id')?.attrs.id;
        const delayEl = stanza.getChild('delay');
        const from = parseJid(stanza.attrs.from);
        const body = stanza.getChildText('body')?.trim();
        const mucUser = stanza.getChild('x', mucUserNs)?.getChild('item');
        const applyId = stanza.getChild('apply-to')?.attrs.id;
        const retract = stanza.getChild('apply-to')?.getChild('retract') ||
            stanza.getChild('apply-to')?.getChild('moderated')?.getChild('retract');
        let contact: IContact;

        if (ocId) {
            const originId = stanza.getChild('origin-id')?.attrs.id;
            const id = originId ?? stanza.getChild('stanza-id')?.attrs.id;
            const replace = stanza.getChild('replace');

            if (!this.rooms.get(from.local)?.contacts.get(ocId)) {
                const role = this.moderatorsList.some(user => user.ocid === ocId) ?
                    'moderator' : mucUser?.attrs.role;
                this.rooms.get(from.local)?.contacts.set(ocId, contact = {
                    nickname: from.resource,
                    role: role,
                    jid: mucUser ? parseJid(mucUser?.attrs.jid) : null,
                });
            } else {
                contact = this.rooms.get(from.local)?.contacts.get(ocId);
            }

            if (from?.resource && body && !replace) {

                if (this.maxMsgCount === this.rooms.get(from.local)?.messageStore.newMessages.length - 1) {
                    this.retractMsg(this.rooms.get(from.local)?.messageStore.newMessages[0].id, from.local);
                }

                const message: INewMsg = {
                    type: 'new',
                    ocId: ocId,
                    // history has date, new messages - no
                    datetime: delayEl ? new Date(delayEl?.attrs.stamp) : new Date(),
                    body: body,
                    direction: this.selfOId.has(ocId) ? Direction.out : Direction.in,
                    id: id,
                    from: contact,
                    read: this.roomConnected$.getValue() !== 'connected',
                    show: true,
                };
                this.rooms.get(from.local)?.messageStore.addMessage(message);
            }

            if (replace) {
                const message: IReplaceMsg = {
                    type: 'replace',
                    id: originId,
                    repId: replace.attrs.id,
                    body: body,
                };

                this.rooms.get(from.local)?.messageStore.replaceMessage(message);
            }
        }

        if (retract) {
            this.retractMsg(applyId, from.local);
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

                const author: string = user.getChild('actor')?.attrs.nick;
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
        }
    }

    protected retractMsg(id: string, local: string): void {
        const message: IRetractMsg = {
            type: 'retract',
            id: id,
        };

        this.rooms.get(local)?.messageStore.deleteMessage(message);
    }
}
