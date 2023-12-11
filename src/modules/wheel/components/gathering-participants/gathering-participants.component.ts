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
} from 'rxjs';
import {DateTime} from 'luxon';
import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
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
    protected timerValue!: DateTime;
    protected ready: BehaviorSubject<boolean> = new BehaviorSubject(false);
    protected timerReady$ = new BehaviorSubject<boolean>(false);
    protected participants$: BehaviorSubject<ParticipantModel[]> = new BehaviorSubject([]);

    constructor(
        @Inject('injectParams') protected params: Params.IGatheringParticipantsCParams,
        @Inject(DOCUMENT) protected document: Document,

        configService: ConfigService,
        protected wheelService: WheelService,
        protected modalService: ModalService,
        protected eventService: EventService,
    ) {
        super(<IMixedParams<Params.IGatheringParticipantsCParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.timerParams = _merge(
            _cloneDeep(Params.timerParams),
            this.$params.timerParams,
        );
        if (this.$params.dataWheel) {
            this.setTimer(this.$params.dataWheel.duration);
            this.ready.next(true);
        } else {
            this.requestWheelInfo();
        }
        this.initSubscription();
    }

    public timerExpiry(): void {
        if (this.$params.completionByButton) {
            if (this.$params.isStreamer) {
                this.timerReady$.next(true);
            } else {
                this.wheelService.internalTimeEnd();
            }
        } else {
            this.wheelService.internalTimeEnd();
        }
    }

    protected initSubscription(): void {
        this.wheelService.participants$.pipe(takeUntil(this.$destroy))
            .subscribe((participants: ParticipantModel[]): void => {
                this.participants$.next(participants);
            });
    }

    protected async requestWheelInfo(): Promise<void> {
        const wheelInfo: IInfoWheelResponse = await this.wheelService.getInfoWheel(this.$params.id);
        this.$params.dataWheel = {
            amount: wheelInfo.amount,
            currency: wheelInfo.currency,
        };
        this.ready.next(true);
        const timeRemaining: string = this.wheelService.modifyDateTimeFormat(
            wheelInfo.finishedAt, wheelInfo.serverTime);
        this.setTimer(timeRemaining);
        this.participants$.next(this.wheelService.getParticipants());
    }

    protected setTimer(timeRemaining: string): void {
        if (+timeRemaining.split(':')[1] > 0 || +timeRemaining.split(':')[0] > 0) {
            this.timerValue = DateTime.now().plus({
                minutes: +timeRemaining.split(':')[0],
                seconds: +timeRemaining.split(':')[1],
            });
        } else {
            this.timerValue = DateTime.now().plus({
                minutes: 0,
                seconds: 0,
            });
            this.timerReady$.next(true);
        }
    }

    protected getLink(id: number): string {
        const site: string = this.configService.get<string>('appConfig.site');
        const lang: string = this.configService.get<string>('appConfig.language');
        const page = this.configService.get<string>('$modules.wheel.pageForLinkWheel')
            || null;

        if (page) {
            return `${site}/${lang}/${page}/?wheel=${id}`;
        } else {
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

    protected calcParticipantsInlineParams(participant: ParticipantModel): IParticipantItemCParams {
        return {
            theme: 'default',
            themeMod: 'default',
            participant: participant,
        };
    }
}
