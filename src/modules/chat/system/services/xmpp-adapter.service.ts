import {
    Inject,
    Injectable,
    NgZone,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {
    Subject,
    BehaviorSubject,
    first,
    Observable,
    firstValueFrom,
    skip,
    timeout,
    catchError,
    of,
} from 'rxjs';
import {
    Client,
    client,
    xml,
} from '@xmpp/client';
import {JID} from '@xmpp/jid';

import {WINDOW} from 'wlc-engine/modules/app/system';
import {IStanza} from 'wlc-engine/modules/chat/system/interfaces';
import {ChatHelper} from 'wlc-engine/modules/chat/system/classes/chat.helper';
import {ChatConfigService} from 'wlc-engine/modules/chat/system/services/chat-config.service';
import {tempUser} from 'wlc-engine/modules/chat/system/constants/core.constants';

export type TChatStatus = 'offline' | 'online' | 'reconnecting' | 'disconnected' | 'failed';

export type TMessageErrors = 'error' | 'wait-error';

export interface IMsgQueueElem {
    msg: string;
    user: string;
    room: string;
    timestamp: number;
    waiter?: {
        $: Subject<boolean | 'error'>;
        cb: () => Observable<boolean | 'error'>;
    };
}

@Injectable({providedIn: 'root'})
export class XMPPAdapterService {
    public client!: Client;
    public userJid: JID;

    protected stanzas$: Subject<IStanza> = new Subject();
    protected errors$: Subject<string> = new Subject();
    protected reconError$: Subject<string> = new Subject();
    protected status$: BehaviorSubject<TChatStatus> = new BehaviorSubject('offline');
    protected roomConnected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    protected pingResolver$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    protected pingId!: string;
    protected msgQueue: Map<string, IMsgQueueElem> = new Map();
    protected errorTypes: {[key: string]: string} = {
        wait: gettext('You have tried to send too many messages ' +
            'in a short amount of time. Please try again later'),
        modify: gettext('You have used profanity in your message. ' +
            'Please rephrase the message and send it again without using prohibited words'),
        link: gettext('Sending links in the chat is prohibited. Please follow the rules'),
        default: gettext('Something went wrong. Please try again later'),
    };

    constructor(
        @Inject(WINDOW) protected window: Window,
        @Inject(DOCUMENT) protected document: Document,
        protected ngZone: NgZone,
        protected config: ChatConfigService,
    ){}

    public get stanzaStream$(): Observable<IStanza> {
        return this.stanzas$.asObservable();
    }

    public get clientStatus$(): Observable<TChatStatus> {
        return this.status$.asObservable();
    }

    public get errorText$(): Observable<string> {
        return this.errors$.asObservable();
    }

    public get clientStatus(): TChatStatus {
        return this.status$.getValue();
    }

    public get isTempUser(): boolean {
        return this.userJid?.local === tempUser.username;
    }

    public get isReconError$(): Observable<string> {
        return this.reconError$.asObservable();
    }
    /**
     * sendQueue
     */
    public clearQueue(): void {
        this.msgQueue.clear();
    }

    /**
     * Send chat message to socket
     * @param roomAddress room address
     * @param message
     * @returns
     */
    public send(roomAddress: string, message: string): Observable<boolean | 'error'> {
        const waiter$ = new Subject<boolean | 'error'>();
        const id = ChatHelper.id();

        const msgQueueEl: IMsgQueueElem = {
            msg: message,
            user: this.userJid.bare().toString(),
            room: roomAddress,
            timestamp: Date.now(),
            waiter: {
                $: waiter$,
                cb: () => waiter$.pipe(
                    timeout(this.config.base.pingPongConfig.messageWaitDelay),
                    catchError(() => of(false)),
                    first(),
                ),
            },
        };

        this.msgQueue.set(id, msgQueueEl);

        this.client.send(xml('message', {
            from: this.userJid.bare().toString(),
            to: roomAddress,
            type: 'groupchat',
            id: id,
        }, xml('body', {}, message)));

        return msgQueueEl.waiter.cb();
    }

    public async authClient(username: string, password: string): Promise<void> {
        await this.ngZone.runOutsideAngular(async () => {
            this.client = client({
                domain: this.config.domain,
                service: this.config.service,
                username,
                password,
            });

            this.client.on('online', (jid: JID) => {
                return this.ngZone.run(() => {
                    return this.onOnlineJid(jid);
                });
            });

            this.client.on('error', (error: unknown) => {
                if (error.toString().includes('not-authorized')) {
                    this.reconError$.next('reconnection error');
                }
                console.error('CHAT', error);
            });

            this.client.on('disconnect', () => {
                this.ngZone.run(() => {
                    this.status$.next('reconnecting');
                });
            });

            this.client.on('offline', () => {
                this.ngZone.run(() => {
                    this.onOffline();
                });
            });

            this.client.on('stanza', (stanza: IStanza) => {
                const id = stanza.attrs.id;

                if (id && id === this.pingId && stanza.attrs.type === 'result') {
                    this.pingResolver$.next(true);
                }

                if (stanza.is('message') && this.msgQueue.has(id)) {
                    if (stanza.getChild('error')) {
                        this.msgQueue.get(id).waiter.$.next('error');
                        this.errorTypeHandler(stanza.getChild('error').attrs.type);
                    }
                    this.msgQueue.get(id).waiter.$.next(true);
                    this.msgQueue.delete(id);
                }

                this.ngZone.run(() => {
                    if (this.skipXmppClientResponses(stanza)) {
                        return;
                    }
                    this.stanzas$.next(stanza);
                });
            });

            this.client.start();
        });

        await firstValueFrom(this.status$.pipe(first(v => v === 'online')));
    }

    public async roomEnter(roomAddress: string, nickname: string): Promise<void> {
        await this.client.send(xml(
            'presence',
            {
                id: ChatHelper.id(),
                to: roomAddress + '/' + (nickname || this.userJid.local),
                from: this.userJid.bare().toString(),
            },
            xml('x', {xmlns: 'http://jabber.org/protocol/muc'}),
        ));
    }

    public roomExit(roomAddress: string, nickname: string, msg: string = ''): void {
        this.client.send(xml(
            'presence',
            {
                id: ChatHelper.id(),
                to: roomAddress + '/' + (nickname || this.userJid.local),
                from: this.userJid.bare().toString(),
                type: 'unavailable',
            }, xml('status', {}, msg),
        ));
    }

    public async logout(): Promise<void> {
        if (this.client) {
            try {
                this.client.reconnect.stop();
                await this.client.send(xml('presence', {type: 'unavailable'}));
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log('%c error sending unavailable', 'background: black; color: chartreuse; font-size: 14px');
            } finally {
                this.client.stop();
                await firstValueFrom(this.status$.pipe(first(v => v === 'offline')));
            }
        }
    }

    protected onOffline(): void {
        this.userJid = null;
        this.status$.next('offline');
    }

    protected onError(): void {
        this.status$.next('failed');
    }

    protected onOnlineJid(jid: JID): void {
        this.userJid = jid;
        this.status$.next('online');
    }

    public errorTypeHandler(type: string): void {
        const error = this.errorTypes[type] ?? this.errorTypes.default;
        this.errors$.next(error);
    }

    public checkPing(): Observable<boolean> {
        this.pingId = ChatHelper.id();

        this.client.send(xml('iq', {
            from: this.userJid.bare().toString(),
            to: this.userJid.domain,
            type: 'get',
            id: this.pingId,
        }, xml('ping', {xmlns: 'urn:xmpp:ping'})));

        this.pingResolver$.next(false);

        return this.pingResolver$.pipe(
            skip(1),
            timeout(this.config.base.pingPongConfig.pongDelay),
            catchError(() => this.pingResolver$),
            first(),
        );
    }

    /**
     * We should skip our iq handling for the following xmpp/client response:
     * - resource bind on start by https://xmpp.org/rfcs/rfc6120.html#bind
     */
    private skipXmppClientResponses(stanza: IStanza): boolean {
        const xmppBindNS = 'urn:ietf:params:xml:ns:xmpp-bind';
        return stanza.getChild('bind')?.getNS() === xmppBindNS;
    }

}
