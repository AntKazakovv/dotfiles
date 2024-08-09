import {Injectable} from '@angular/core';

import {
    Subject,
    firstValueFrom,
    BehaviorSubject,
    first,
    Subscription,
} from 'rxjs';
import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import _toString from 'lodash-es/toString';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    EventService,
    ConfigService,
    DataService,
    NotificationEvents,
    IPushMessageParams,
    IData,
    InjectionService,
    ModalService,
    DateHelper,
    WebsocketService,
} from 'wlc-engine/modules/core';

import {
    UserInfo,
    UserService,
} from 'wlc-engine/modules/user';

import {CreateWheelComponent} from 'wlc-engine/modules/wheel/components/create-wheel/create-wheel.component';
import {GatheringParticipantsComponent} from
    'wlc-engine/modules/wheel/components/gathering-participants/gathering-participants.component';
import {IGatheringParticipantsCParams} from
    'wlc-engine/modules/wheel/components/gathering-participants/gathering-participants.params';
import {WaitingResultsComponent} from
    'wlc-engine/modules/wheel/components/waiting-results/waiting-results.component';
import {CancelRaffleComponent} from
    'wlc-engine/modules/wheel/components/cancel-raffle/cancel-raffle.component';
import {SelectionWinnerComponent} from
    'wlc-engine/modules/wheel/components/selection-winner/selection-winner.component';
import {ISelectionWinnerCParams} from
    'wlc-engine/modules/wheel/components/selection-winner/selection-winner.params';
import {ResultWheelComponent} from 'wlc-engine/modules/wheel/components/result-wheel/result-wheel.component';
import {IResultWheelCParams} from
    'wlc-engine/modules/wheel/components/result-wheel/result-wheel.params';

import {
    ISettingsWheel,
    IUserWheel,
    IInfoWheelResponse,
    IWSStreamWheel,
    IParticipantRest,
    IEventWidgetWheel,
    IWinner,
} from 'wlc-engine/modules/wheel/system/interfaces';
import {ParticipantModel} from 'wlc-engine/modules/wheel/system/models';
import {WebSocketEvents} from 'wlc-engine/modules/core/system/services/websocket/websocket.service';

interface ICreateWheelResponse {
    result?: boolean;
    wheelId?: number;
    nonce?: string;
}

interface IJoinWheelResponse {
    data?: IInfoWheelResponse;
    result?: boolean;
    message?: string;
}

type TCompletion  = 'auto' | 'button';

@Injectable({providedIn: 'root'})

export class WheelService {
    public wheelInfo$: Subject<IInfoWheelResponse> = new Subject<IInfoWheelResponse>();
    public eventsWheel$: Subject<IEventWidgetWheel> = new Subject<IEventWidgetWheel>();
    public showButtonResults$: Subject<boolean> = new Subject<boolean>();
    public completionByButton: boolean = false;
    public wheelInfo: IInfoWheelResponse;
    public settingsWheel: ISettingsWheel;
    public userWheel$: Subject<IUserWheel> = new Subject<IUserWheel>();
    public participants$: Subject<ParticipantModel[]> = new Subject<ParticipantModel[]>();
    public timerReady$ = new BehaviorSubject<boolean>(false);
    private userService: UserService;
    private infoWheelSocketSub: Subscription;
    private userWheel: IUserWheel;
    private winners: IWinner[] = [];
    private participants: ParticipantModel[] = [];
    private disableFinishFromSocket: boolean = false;
    private currentIdWheel: number = 0;
    private currentNonce: string = '';
    private _redirectorUrl: string;

    constructor(
        private eventService: EventService,
        private configService: ConfigService,
        private injectionService: InjectionService,
        private dataService: DataService,
        private modalService: ModalService,
        private webSocketService: WebsocketService,

    ) {
        this.init();
    }

    public async init(): Promise<void> {
        await this.configService.ready;
        if (this.configService.get<boolean>('appConfig.siteconfig.StreamWheel')) {
            this.initCompletion();
            this.registerMethods();
            this.initSubscribers();
            ParticipantModel.folder = this.configService.get<string>('$modules.wheel.avatarsFolder') ||
                '/wlc/prize-wheel/avatars/';
        }
    }

    public getUserAvatar(idUser: number): string {
        const array = Array.from(idUser.toString(), Number);
        const firstNum = array[array.length - 2] > 4 ? 1 : 0;
        const secondNum = array[array.length - 1];
        return `${ParticipantModel.folder}avatar-${firstNum}${secondNum}.png`;
    }

    public closeModalsWaiting(): void {
        this.modalService.hideModal('waiting-results');
    }

    public async getPrizeWheelUserInfo(): Promise<void> {
        if (!this.userService) {
            this.userService = await this.injectionService.getService<UserService>('user.user-service');
        }
        await this.userService.fetchUserInfo();
        const userInfo: UserInfo = await firstValueFrom(
            this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
                .pipe(
                    first((userInfo: UserInfo): boolean => !!userInfo?.idUser),
                ),
        );
        this.userWheel = {
            idUser: +userInfo.idUser,
            isStreamer: userInfo.allowAccessToAddStreamWheel,
            streamWheelsParticipant: userInfo.streamWheelsParticipant,
            streamWheelOwner: userInfo.streamWheelOwner,
            currency: this.userService.userProfile.currency,
        };
    }

    public processingUserWheel(): void {
        if (this.userWheel) {
            if (this.userWheel.isStreamer) {
                if (this.userWheel.streamWheelOwner) {
                    this.setInfoWheelSocketSubscription();
                    this.eventsWheel$.next({name: 'updateWidget', data: this.userWheel.streamWheelOwner});
                    this.currentNonce = this.getNonceFromStorage();
                } else {
                    this.eventsWheel$.next({name: 'showWidget'});
                }
            } else if (this.userWheel.streamWheelsParticipant && this.userWheel.streamWheelsParticipant.length) {
                this.setInfoWheelSocketSubscription();
                this.eventsWheel$.next({name: 'updateWidget', data: this.userWheel.streamWheelsParticipant[0]});
            }
        }
    }

    public showWinnersModal(): void {
        const itsWinner = this.winners.find(user => user.id === this.userWheel.idUser);

        if (itsWinner) {
            this.modalService.hideModal('selection-winner');
            this.modalService.showModal({
                id: 'result-wheel',
                modifier: 'result-wheel',
                component: ResultWheelComponent,
                componentParams: <IResultWheelCParams>{
                    itsYou: true,
                    amountPrize: itsWinner.amount,
                    winners: this.winners,
                    currency: itsWinner.currency,
                },
                showFooter: false,
                size: 'xl',
                backdrop: 'static',
            });
        } else {
            this.modalService.closeAllModals('selection-winner');
            this.modalService.showModal({
                id: 'result-wheel',
                modifier: 'result-wheel',
                component: ResultWheelComponent,
                componentParams: <IResultWheelCParams>{
                    itsYou: false,
                    amountPrize: +this.wheelInfo.amount,
                    winners: this.winners,
                    currency: this.wheelInfo.currency,
                    isStreamer: this.userWheel.isStreamer,
                },
                showFooter: false,
                size: 'xl',
                backdrop: 'static',
            });
        }
        this.finishWheel();
    }

    public getUserWheel(): IUserWheel {
        return this.userWheel;
    }

    public async setInfoWheelSocketSubscription(): Promise<void> {
        this.infoWheelSocketSub = this.webSocketService.getMessages(
            {endPoint: 'wsc2', events: [WebSocketEvents.RECEIVE.STREAMWHEEL]}).subscribe(
            {
                next: (message: IWSStreamWheel) => {
                    if (+message.data.IDWheel === this.currentIdWheel) {
                        switch (message.data.Event) {
                            case 'join':
                                this.joinEventHandler(message.data.Users);
                                break;
                            case 'finish':
                                if (!this.disableFinishFromSocket) {
                                    this.modalService.closeAllModals();

                                    if (message.data.Users) {
                                        this.finishEventHandler(message.data.Users);
                                    } else {
                                        this.showCancelRaffleModal();
                                        this.finishWheel();
                                    }
                                }
                                break;
                        }
                    }
                },
            },
        );
    }

    public async joinUserToWheel(idWheel: number, nonce: string): Promise<void> {
        try {
            await this.getPrizeWheelUserInfo();
            this.setInfoWheelSocketSubscription();
            this.currentIdWheel = idWheel;
            const response: IData<IJoinWheelResponse> = await this.requestJoinToWheel(idWheel, nonce);
            await this.setInfoAfterJoin(response);
            this.showModalAfterJoin(response.data);
            this.eventsWheel$.next({name: 'showWidget'});
        } catch (error) {
            this.finishWheel();
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'warning',
                    title: gettext('Information'),
                    message: error.errors,
                    wlcElement: 'stream-wheel-join-sending-error',
                },
            });
            this.modalService.closeAllModals();
        }
    }

    public async setInfoAfterJoin(response: IData<IJoinWheelResponse>): Promise<void> {
        this.wheelInfo = response.data.data;
        this.wheelInfo.serverTime = Date.parse(response.headers.get('Date'));
        this.wheelInfo$.next(this.wheelInfo);

        if (this.wheelInfo.participantsCount && this.wheelInfo.participants.length) {
            this.prepareParticipants(this.wheelInfo.participants);
        }
    }

    public showModalAfterJoin(response: IJoinWheelResponse): void {
        if (!response.result) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'warning',
                    title: gettext('Information'),
                    message: response.message,
                    wlcElement: 'stream-wheel-rejoin',
                },
            });
        }

        const paramsModal: IGatheringParticipantsCParams = {
            id: this.wheelInfo.id,
            isStreamer: false,
            dataWheel: {
                amount: this.wheelInfo.amount,
                currency: this.wheelInfo.currency,
                duration: this.wheelInfo.duration,
                finishedAt: this.wheelInfo.finishedAt,
            },
            serverTime: this.wheelInfo.serverTime,
            mode: 'join',
        };

        this.showGatheringParticipantsModal(paramsModal);
    }

    public showGatheringParticipantsModal(params: IGatheringParticipantsCParams): void {
        this.modalService.showModal({
            id: 'gathering-participants',
            modifier: 'gathering-participants',
            component: GatheringParticipantsComponent,
            componentParams: params,
            showFooter: false,
            size: 'xl',
            backdrop: 'static',
        });
    }

    public async getInfoWheel(id: number): Promise<IInfoWheelResponse> {
        try {
            const response: IData<IInfoWheelResponse> = await this.dataService.request(
                'wheel/getInfoStreamWheel', {id});
            this.currentIdWheel = id;
            this.wheelInfo = response.data;
            this.wheelInfo.serverTime = Date.parse(response.headers.get('Date'));
            this._redirectorUrl = response.data.StreamWheelRedirectorUrl;
            this.wheelInfo$.next(this.wheelInfo);

            if (this.wheelInfo.participantsCount && this.wheelInfo.participants.length) {
                this.prepareParticipants(this.wheelInfo.participants);
            }

            return this.wheelInfo;

        } catch (error) {
            if (!this.modalService.getActiveModal('waiting-results')) {
                this.modalService.closeAllModals();
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams> {
                        type: 'error',
                        title: gettext('Error'),
                        message: error.errors,
                        wlcElement: 'stream-wheel-get-info-error',
                    },
                });
            }
        }
    }

    public prepareParticipants(arrParticipants: IParticipantRest[]): void {
        arrParticipants.forEach((participant: IParticipantRest) => {
            if (!this.participants.find(user => user.id === participant.id)) {
                this.participants.unshift(new ParticipantModel(
                    {
                        component: 'wheel-service',
                        method: 'prepareParticipants',
                    },
                    {
                        name: participant.screenName,
                        id: participant.id,
                    },
                ));
            }
        });
        this.participants$.next(this.participants);
    }

    public getParticipants(): ParticipantModel[] {
        return this.participants;
    }

    public async getActualParticipants(): Promise<ParticipantModel[]> {
        await this.getInfoWheel(this.currentIdWheel);
        return this.participants;
    }

    public async makeFinishWheel(id: number): Promise<void> {
        try {
            this.showWaitingResultsModal();
            await this.requestFinishWheel(id);
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Error'),
                    message: error.errors,
                    wlcElement: 'stream-wheel-make-finish-error',
                },
            });
        }
    }

    public async openWheel(): Promise<void> {
        await this.getPrizeWheelUserInfo();

        if (this.userWheel.isStreamer && !this.userWheel.streamWheelOwner) {
            this.modalService.showModal({
                id: 'create-wheel',
                modifier: 'create-wheel',
                component: CreateWheelComponent,
                showFooter: false,
                size: 'xl',
                backdrop: 'static',
            });
        }

        if (this.userWheel.streamWheelOwner) {

            const paramsModal: IGatheringParticipantsCParams = {
                id: this.userWheel.streamWheelOwner,
                isStreamer: true,
                completionByButton: this.completionByButton,
                nonce: this.currentNonce,
                mode: 'show',
            };
            this.showGatheringParticipantsModal(paramsModal);
        }

        if (this.userWheel.streamWheelsParticipant
            && this.userWheel.streamWheelsParticipant.length
        ) {
            this.showGatheringParticipantsModal({
                id: this.userWheel.streamWheelsParticipant[0],
                mode: 'show',
            });
        }
    }

    public async internalTimeEnd(): Promise<void> {
        this.modalService.closeAllModals();
        this.showWaitingResultsModal();
    }

    public modifyDateTimeFormat(incomTime: string, serverTime: number): string {
        const time: Dayjs = dayjs(incomTime).add(dayjs().utcOffset(), 'minute');
        const timeDifference: number = (time.unix() - serverTime);
        const seconds = Math.floor(timeDifference
            / DateHelper.milliSecondsInSecond % DateHelper.secondsInMinute);
        const minutes = Math.floor(timeDifference
            / DateHelper.milliSecondsInMinutes);
        return `${minutes}:${seconds}`;
    }

    public requestDeleteWheel(): Promise<IData> {
        return this.dataService.request('wheel/cancelStreamWheel');
    }

    public async requestJoinToWheel(id: number, nonce: string): Promise<IData> {
        try {
            const response: IData = await this.dataService.request(
                'wheel/joinToStreamWheel', {id, nonce});
            return response;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async requestFinishWheel(id: number): Promise<IData> {
        try {
            const response: IData = await this.dataService.request(
                'wheel/finishStreamWheel', {id});
            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public getCurrentNonce(): string {
        return this.currentNonce ?? '';
    }

    public async getWinnersFromHttp(): Promise<void> {
        this.disableFinishFromSocket = true;
        let wheelInfo: IInfoWheelResponse;

        try {
            wheelInfo = await this.getInfoWheel(this.currentIdWheel);
        } catch (error) {
            Promise.reject(error);
        }

        if (this.userWheel.isStreamer) {

            if (wheelInfo?.status > 0) {

                if (wheelInfo.winners) {

                    if (wheelInfo.winners.length) {
                        this.modalService.closeAllModals();
                        this.finishEventHandler(wheelInfo.winners);
                    } else {
                        this.showCancelRaffleModal();
                        this.finishWheel();
                    }
                } else {
                    this.winnersHttpCallback(5000);
                }

            } else {
                this.winnersHttpCallback(5000);
            }
        } else {
            this.disableFinishFromSocket = true;

            if (wheelInfo?.status > 0) {

                if (wheelInfo.winners) {

                    if (wheelInfo.winners.length) {
                        this.modalService.closeAllModals();
                        this.finishEventHandler(wheelInfo.winners);
                    } else {
                        this.showCancelRaffleModal();
                        this.finishWheel();
                    }
                } else {
                    this.noResultsHandler(10000);
                }
            } else {
                this.noResultsHandler(10000);
            }
        }
    }

    public setTimerStatus(status: boolean): void {
        this.timerReady$.next(status);
    }

    protected winnersHttpCallback(timeout: number): void {
        setTimeout(() => {
            this.getWinnersFromHttp();
        }, timeout);
    }

    protected noResultsHandler(timeout: number): void {
        this.showUnknownResultsNotify();
        this.showButtonResults$.next(false);
        setTimeout(() => {
            this.showButtonResults$.next(true);
        }, timeout);
    }

    protected showUnknownResultsNotify(): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'warning',
                title: gettext('Information'),
                message: gettext('Results are unknown yet, try again later'),
                wlcElement: 'stream-wheel-join-sending-error',
            },
        });
    }

    public get redirectorUrl(): string {
        return this._redirectorUrl;
    }

    public async createWheel(data: ISettingsWheel): Promise<void> {
        try {
            const requestData: ISettingsWheel = _cloneDeep(data);
            requestData.duration = _toString(this.modifyDurationTime(data));
            const response: IData<ICreateWheelResponse> = await this.dataService.request(
                'wheel/createStreamWheel', requestData);

            this.currentIdWheel = response.data.wheelId;
            this.currentNonce = response.data.nonce;
            this.setNonceToStorage(response.data.nonce);

            const paramsModal: IGatheringParticipantsCParams = {
                id: response.data.wheelId,
                isStreamer: true,
                dataWheel: {
                    amount: data.amount,
                    currency: this.userWheel.currency,
                    duration: data.duration,
                },
                serverTime: Date.parse(response.headers.get('Date')),
                mode: 'create',
                nonce: response.data.nonce,
            };
            this.showGatheringParticipantsModal(paramsModal);
            this.eventsWheel$.next({name: 'updateWidget', data: response.data.wheelId});
            this.setInfoWheelSocketSubscription();
            this.modalService.hideModal('create-wheel');
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Error'),
                    message: error.errors,
                    wlcElement: 'stream-wheel-create-sending-error',
                },
            });
        }
    }

    private async initSubscribers(): Promise<void> {
        const isAuth = this.configService.get<boolean>('$user.isAuthenticated');

        if (isAuth) {
            await this.getPrizeWheelUserInfo();
            this.processingUserWheel();
        }

        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            const listOpenModals: string[] = [
                'gathering-participants', 'waiting-results', 'result-wheel',
                'selection-winner', 'cancel-contest', 'create-wheel'];
            listOpenModals.forEach((modalId: string) => {
                if (this.modalService.getActiveModal(modalId)) {
                    this.modalService.hideModal(modalId);
                }
            });
            this.participants = [];
            this.participants$.next(this.participants);
            this.eventsWheel$.next({name: 'deleteWidget'});
        });
        this.eventService.subscribe({
            name: 'LOGIN',
        }, async () => {
            await this.getPrizeWheelUserInfo();
            this.processingUserWheel();
        });

        this.eventService.subscribe({
            name: 'CHANGE_LANGUAGE',
        }, () => {
            this.processingUserWheel();
        });
    }

    private initCompletion(): void {
        const completion = this.configService.get<TCompletion>('appConfig.siteconfig.StreamWheelCompletion');
        switch (completion) {
            case 'auto':
                this.completionByButton  = false;
                break;
            case 'button':
                this.completionByButton  = true;
                break;
        }
    }

    private modifyDurationTime(settingsWheel: ISettingsWheel): number {
        const timerValue = dayjs()
            .add(+settingsWheel.duration.split(':')[0], 'minute')
            .add(+settingsWheel.duration.split(':')[1], 'second');

        return Math.ceil(timerValue.unix() - dayjs().unix());
    }

    private finishEventHandler(winners: string | IWinner[]): void {
        this.winners = [];
        let winnersTmp;

        if (Array.isArray(winners)) {
            winnersTmp = winners.slice();
            for (const user in winnersTmp) {
                this.winners.push({
                    amount: +winnersTmp[user].amount,
                    currency: winnersTmp[user].currency,
                    name: (winnersTmp[user].name && winnersTmp[user].lastName)
                        ? winnersTmp[user].name + winnersTmp[user].lastName
                        : winnersTmp[user].email,
                    id: +winnersTmp[user].id,
                    avatar: this.getUserAvatar(+winnersTmp[user].id),
                });
            }
        } else {
            winnersTmp = JSON.parse(winners);

            for (const user in winnersTmp) {
                this.winners.push({
                    amount: +winnersTmp[user].Amount,
                    currency: winnersTmp[user].Currency,
                    name: (winnersTmp[user].Name && winnersTmp[user].LastName)
                        ? winnersTmp[user].Name + winnersTmp[user].LastName
                        : winnersTmp[user].Email,
                    id: +winnersTmp[user].ID,
                    avatar: this.getUserAvatar(+winnersTmp[user].ID),
                });
            }
        }

        this.showSelectionWinnersModal();
    }

    private joinEventHandler(usersJson: string): void {
        const users = JSON.parse(usersJson);
        const participants: IParticipantRest[] = [];

        for (const user in users) {
            if (!users[user].Name && !users[user].LastName) {
                participants.push({
                    screenName: users[user].Email,
                    id: +users[user].ID,
                });
            } else {
                participants.push({
                    screenName: users[user].Name + users[user].LastName,
                    id: +users[user].ID,
                });
            }
        }
        this.prepareParticipants(participants);
    }

    private showSelectionWinnersModal(): void {
        this.modalService.showModal({
            id: 'selection-winner',
            modifier: 'selection-winner',
            component: SelectionWinnerComponent,
            componentParams: <ISelectionWinnerCParams>{
                numberParticipants: this.participants.length,
                competitionAmount: +this.wheelInfo.amount,
                currency: this.wheelInfo.currency,
                numberWinners: +this.wheelInfo.winnersCount,
                participants: this.participants,
                winners: this.winners,
            },
            showFooter: false,
            keyboard: false,
            backdrop: 'static',
            closeBtnVisibility: false,
            size: 'xl',
        });
    }

    private finishWheel(): void {
        if (this.userWheel.isStreamer) {
            this.eventsWheel$.next({name: 'resetWidget'});
            this.clearNonce();
        } else {
            this.eventsWheel$.next({name: 'deleteWidget'});
        }
        this.setTimerStatus(false);
        this.participants = [];
        this.participants$.next(this.participants);
        this.infoWheelSocketSub.unsubscribe();
    }

    private showWaitingResultsModal(): void {
        this.modalService.showModal({
            id: 'waiting-results',
            modifier: 'waiting-results',
            component: WaitingResultsComponent,
            showFooter: false,
            size: 'xl',
            backdrop: 'static',
        });
    }

    private showCancelRaffleModal(): void {
        this.modalService.showModal({
            id: 'cancel-contest',
            modifier: 'cancel-contest',
            component: CancelRaffleComponent,
            showFooter: false,
            size: 'xl',
            backdrop: 'static',
        });
    }

    private setNonceToStorage(value: string): void {
        this.configService.set({
            name: 'wheelNonce',
            value: value,
            storageType: 'localStorage',
        });
    }

    private getNonceFromStorage(): string {
        return this.configService.get({
            name: 'wheelNonce',
            storageType: 'localStorage',
        });
    }

    private clearNonce(): void {
        this.currentNonce = '';
        this.configService.set({
            name: 'wheelNonce',
            value: null,
            storageClear: 'localStorage',
        });
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'createStreamWheel',
            system: 'wheel',
            url: '/streamWheel',
            type: 'POST',
            events: {
                success: 'WHEEL_CREATE',
                fail: 'WHEEL_CREATE_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'cancelStreamWheel',
            system: 'wheel',
            url: '/streamWheel',
            type: 'DELETE',
            events: {
                success: 'WHEEL_DELETED',
                fail: 'WHEEL_DELETE_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'getInfoStreamWheel',
            system: 'wheel',
            url: '/streamWheel',
            type: 'GET',
            events: {
                success: 'WHEEL_INFO',
                fail: 'WHEEL_INFO_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'finishStreamWheel',
            system: 'wheel',
            url: '/streamWheel',
            type: 'PUT',
            events: {
                success: 'WHEEL_FINISH',
                fail: 'WHEEL_FINISH_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'joinToStreamWheel',
            system: 'wheel',
            url: '/streamWheel/participants',
            type: 'POST',
            events: {
                success: 'WHEEL_JOIN',
                fail: 'WHEEL_JOIN_ERROR',
            },
        });
    }
}
