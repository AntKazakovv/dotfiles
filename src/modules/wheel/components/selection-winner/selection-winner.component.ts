import {DOCUMENT} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
    Renderer2,
    ElementRef,
} from '@angular/core';

import _forEach from 'lodash-es/forEach';

import {
    AbstractComponent,
    IMixedParams,
    LogService,
} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';

import {WheelService} from 'wlc-engine/modules/wheel/system/services';
import {ParticipantModel} from 'wlc-engine/modules/wheel/system/models';
import {IParticipantItemCParams} from
    'wlc-engine/modules/wheel/components/participant-item/participant-item.params';
import {IWinner} from 'wlc-engine/modules/wheel/system/interfaces';

import * as Params from './selection-winner.params';

export type TLineTranslate = {text: string, context: Params.ISelectionWinnerCParams};

@Component({
    selector: '[wlc-selection-winner]',
    templateUrl: './selection-winner.component.html',
    styleUrls: ['./styles/selection-winner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionWinnerComponent extends AbstractComponent implements OnInit {

    public override $params!: Params.ISelectionWinnerCParams;
    protected participants: ParticipantModel[] = [];
    protected winners: IWinner[] = [];
    protected drumLines = [];
    protected participantsWH: Array<ParticipantModel[]> = [];
    protected translatesParticipantsAmt: TLineTranslate;

    constructor(
        @Inject('injectParams') protected params: Params.ISelectionWinnerCParams,
        @Inject(DOCUMENT) protected document: Document,
        protected renderer: Renderer2,
        protected element: ElementRef,
        protected wheelService: WheelService,
        protected logService: LogService,
        @Inject(WINDOW) private window: Window,
    ) {
        super(<IMixedParams<Params.ISelectionWinnerCParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.translatesParticipantsAmt = {
            text: gettext('Selecting from {{numberParticipants}} participants'),
            context: this.$params,
        };
        this.drumLines = new Array(this.$params.numberWinners);
        this.prepareParticipants();
        this.timerStartVisual();
        this.wheelService.closeModalsWaiting();
    }

    protected prepareParticipants(): void {
        const maxLengthParticipants = 35;
        const posWinner = 30;
        this.participants = this.$params.participants;
        this.winners = this.$params.winners;
        this.winners.forEach((winner: IWinner) => {
            let tmp: ParticipantModel[] = [];
            Object.assign(tmp, this.participants);
            let winnerParticipant = tmp.find(user => user.id === winner.id);

            if (winnerParticipant) {
                const indexWinner = this.participants.indexOf(winnerParticipant);
                this.participants.splice(indexWinner, 1);
            } else {
                winnerParticipant = new ParticipantModel(
                    {
                        component: 'selection-winners',
                        method: 'prepareParticipants',
                    },
                    {
                        name: winner.name,
                        id: winner.id,
                        avatar: this.wheelService.getUserAvatar(+winner.id),
                    });
            }

            if (tmp.length < maxLengthParticipants) {
                while (tmp.length < maxLengthParticipants) {
                    tmp.push(...tmp);
                }
            } else {
                tmp = tmp.slice(0, maxLengthParticipants);
            }

            Object.assign(tmp, this.shuffleParticipants(tmp));
            tmp.splice(posWinner, 0, winnerParticipant);
            this.participantsWH.push(tmp);
        });
    }

    protected timerStartVisual(): void {
        setTimeout(() => {
            this.startSpin();
            this.timerShowWinners();
        }, 6000);
    }

    protected timerShowWinners(): void {
        setTimeout(() => {
            this.wheelService.showWinnersModal();
        }, (6000 + (this.$params.numberWinners * 5000)));
    }

    protected shuffleParticipants(mas: ParticipantModel[]): ParticipantModel[] {
        for (let i = mas.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [mas[i], mas[j]] = [mas[j], mas[i]];
        }
        return mas;
    }

    protected getParticipantsInlineParams(participant: ParticipantModel): IParticipantItemCParams {
        return {
            participant: participant,
            theme: this.$params.theme,
            themeMod: this.$params.themeMod,
        };
    }

    protected startSpin(): void {
        let drums = this.element.nativeElement.querySelectorAll('.wlc-selection-winner__drum-line');

        _forEach(drums, (element: HTMLElement, index): void => {
            this.renderer.addClass(element, `drum-line${index}`);
            let participants = this.renderer.parentNode(element)?.querySelectorAll('.wlc-participant-item');
            let shift = '-28';
            if (this.window.innerWidth < 768) {
                shift = '-23.45';
            }
            _forEach(participants, (element: HTMLElement) => {
                element.style.setProperty('--shift', shift);
            });
        });

        _forEach(drums, (element: HTMLElement): void => {
            element.classList.toggle('animation-on');
        });
    }
}
