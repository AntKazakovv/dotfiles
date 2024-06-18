import {DOCUMENT} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
    Input,
} from '@angular/core';

import {
    BehaviorSubject,
    takeUntil,
    first,
    tap,
} from 'rxjs';
import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    AbstractComponent,
    IMixedParams,
    ITimerCParams,
    ModalService,
    EventService,
    NotificationEvents,
    IPushMessageParams,
} from 'wlc-engine/modules/core';
import {WheelService} from 'wlc-engine/modules/wheel/system/services/wheel.service';
import {ParticipantModel} from 'wlc-engine/modules/wheel/system/models/participant.model';
import {IParticipantItemCParams} from
    'wlc-engine/modules/wheel/components/participant-item/participant-item.params';
import {IInfoWheelResponse} from 'wlc-engine/modules/wheel/system/interfaces/wheel.interface';

import * as Params from './gathering-participants.params';

@Component({
    selector: '[wlc-gathering-participants]',
    templateUrl: './gathering-participants.component.html',
    styleUrls: ['./styles/gathering-participants.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GatheringParticipantsComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.IGatheringParticipantsCParams;
    public override $params!: Params.IGatheringParticipantsCParams;
    protected timerParams: ITimerCParams = {};
    protected timerValue!: Dayjs;
    protected ready: BehaviorSubject<boolean> = new BehaviorSubject(false);
    protected timerReady$ = new BehaviorSubject<boolean>(false);
    protected participants$: BehaviorSubject<ParticipantModel[]> = new BehaviorSubject([]);
    protected currentNonce: string;

    constructor(
        @Inject('injectParams') protected params: Params.IGatheringParticipantsCParams,
        @Inject(DOCUMENT) protected document: Document,

        protected wheelService: WheelService,
        protected modalService: ModalService,
        protected eventService: EventService,
    ) {
        super(<IMixedParams<Params.IGatheringParticipantsCParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        });
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.timerParams = _merge(
            _cloneDeep(Params.timerParams),
            this.$params.timerParams,
        );

        switch (this.$params.mode) {
            case 'create':
                this.setTimer(this.$params.dataWheel.duration);
                this.ready.next(true);
                break;
            case 'join':
                this.calcTimeRemaining(this.$params.dataWheel.finishedAt, this.$params.serverTime);
                this.participants$.next(await this.wheelService.getActualParticipants());
                this.ready.next(true);
                break;
            case 'show':
                this.requestWheelInfo();
                break;
        }
        this.initSubscription();
    }

    protected initSubscription(): void {
        this.wheelService.participants$.pipe(takeUntil(this.$destroy))
            .subscribe((participants: ParticipantModel[]): void => {
                this.participants$.next(participants);
            });

        if (this.$params.completionByButton && this.$params.isStreamer) {
            this.wheelService.timerReady$
                .pipe(
                    first(v => !!v),
                    tap(() => {
                        this.timerReady$.next(true);
                    }),
                    takeUntil(this.$destroy),
                )
                .subscribe();
        }
    }

    protected async requestWheelInfo(): Promise<void> {
        const wheelInfo: IInfoWheelResponse = await this.wheelService.getInfoWheel(this.$params.id);
        this.$params.dataWheel = {
            amount: wheelInfo.amount,
            currency: wheelInfo.currency,
        };
        this.currentNonce = wheelInfo.nonce || this.wheelService.getCurrentNonce();
        this.ready.next(true);
        this.calcTimeRemaining(wheelInfo.finishedAt, wheelInfo.serverTime);
        this.participants$.next(this.wheelService.getParticipants());
    }

    protected calcTimeRemaining(finishedAt: string, serverTime: number): void {
        const timeRemaining: string = this.wheelService.modifyDateTimeFormat(
            finishedAt, serverTime);
        this.setTimer(timeRemaining);
    }

    protected setTimer(timeRemaining: string): void {
        if (+timeRemaining.split(':')[1] > 0 || +timeRemaining.split(':')[0] > 0) {
            this.timerValue = dayjs()
                .add(+timeRemaining.split(':')[0], 'minute')
                .add(+timeRemaining.split(':')[1], 'second');
        } else {
            this.timerValue = dayjs()
                .add(0, 'minute')
                .add(0, 'second');
            this.timerReady$.next(true);
        }
    }

    protected getLink(id: number): string {
        const site: string = this.wheelService.redirectorUrl || this.configService.get<string>('appConfig.site');
        const lang: string = this.configService.get<string>('appConfig.language');
        const page = this.configService.get<string>('$modules.wheel.pageForLinkWheel') || null;
        const nonce = this.params.nonce ?? this.currentNonce;

        if (page) {

            if (nonce) {
                return `${site}/${lang}/${page}/?wheel=${id}&nonce=${nonce}`;
            }

            if (this.currentNonce) {
                return `${site}/${lang}/${page}/?wheel=${id}&nonce=${this.currentNonce}`;
            }

            return `${site}/${lang}/${page}/?wheel=${id}`;
        } else {
            if (nonce) {
                return `${site}/${lang}/?wheel=${id}&nonce=${nonce}`;
            }

            if (this.currentNonce) {
                return `${site}/${lang}/?wheel=${id}&nonce=${this.currentNonce}`;
            }

            return `${site}/${lang}/?wheel=${id}`;
        }
    }

    protected async copyLink(): Promise<void> {
        await navigator.clipboard.writeText(this.getLink(this.params.id));
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'success',
                title: gettext('Info'),
                message: gettext('Copied to clipboard!'),
                wlcElement: 'notification_input-info',
            },
        });
    }

    protected determineWinners(): void {
        this.modalService.closeAllModals('gathering-participants');
        this.wheelService.makeFinishWheel(this.$params.id);
    }

    protected getParticipantsInlineParams(participant: ParticipantModel): IParticipantItemCParams {
        return {
            theme: 'default',
            themeMod: 'default',
            participant: participant,
        };
    }
}
