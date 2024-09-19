import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Inject,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';

import dayjs from 'dayjs';

import {
    AbstractComponent,
    EventService,
    InjectionService,
    IPushMessageParams,
    ModalService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {
    IOpenRewardResponse,
    IQuestPrizesModalCParams,
    QuestsService,
} from 'wlc-engine/modules/quests';
import {
    Bonus,
    BonusesService,
    IBonusChoiceModalCParams,
    IBonusModalCParams,
} from 'wlc-engine/modules/bonuses';

import * as Params from './quest-progress.params';

@Component({
    selector: '[wlc-quest-progress]',
    templateUrl: './quest-progress.component.html',
    styleUrls: ['./styles/quest-progress.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestProgressComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input() protected inlineParams: Params.IQuestProgressCParams;

    public override $params: Params.IQuestProgressCParams;
    public progressText: string;
    public showTimer: boolean = false;
    public statusImagePath: string;
    public statusImageFallbackPath: string;

    protected injectionService: InjectionService = inject(InjectionService);
    protected modalService: ModalService = inject(ModalService);
    protected eventService: EventService = inject(EventService);
    protected questsService: QuestsService = inject(QuestsService);
    protected bonusesService: BonusesService;
    protected bonusFetching: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IQuestProgressCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.quest) {
            this.init();
        }
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);

        if (this.$params && changes['inlineParams']?.currentValue?.quest) {
            this.init();
        }
    }

    public init(): void {
        this.showTimer = this.$params.quest.renewalTime > dayjs();
        this.progressText = `${this.$params.quest.progressReady} / ${this.$params.quest.progressTotal}`;

        this.statusImagePath = this.getStatusImage(false);
        this.statusImageFallbackPath = this.getStatusImage(true);

        if (this.$params.quest.isCompletedStatus || this.$params.quest.isOpenedStatus) {
            this.addModifiers('completed');
        } else {
            this.removeModifiers('completed');
        }
    }

    public updateQuestsDataHandler(): void {
        this.questsService.queryQuests({withModifier: true});
    }

    public async showBonusInfoHandler(): Promise<void> {
        if (this.$params.quest.isNotCompletedStatus || this.$params.quest.isCompletedStatus) {
            this.bonusFetching = true;

            this.bonusesService ??= await this.injectionService.getService<BonusesService>('bonuses.bonuses-service');

            const rewardBonus: Bonus = await this.bonusesService.getBonus(this.$params.quest.idBonus);

            if (rewardBonus) {
                this.modalService.showModal('bonusModal', <IBonusModalCParams>{
                    bonus: rewardBonus,
                    hideBonusButtons: true,
                });
            }

            this.bonusFetching = false;
            this.cdr.markForCheck();
        }
    }

    public claimHandler(): void {
        this.modalService.showModal(this.$params.questPrizesModalConfig, <IQuestPrizesModalCParams>{
            quest: this.$params.quest,
            onClick: this.openCasket.bind(this),
        });
    }

    public get casketCursor(): string {
        let cursor: string;

        if (this.$params.quest.isFinishedStatus) {
            cursor = 'auto';
        } else if (this.bonusFetching) {
            cursor = 'wait';
        } else {
            cursor = 'pointer';
        }

        return cursor;
    }

    protected getStatusImage(fallback: boolean = false): string {
        let imagePath: string = '';
        const source: Params.IQuestStatusImages = fallback
            ? this.$params.pathsToQuestStatusFallbackImages
            : this.$params.pathsToQuestStatusImages;

        if (this.$params.quest.progressPercent === 0) {
            imagePath = source.noProgress;
        } else if (this.$params.quest.progressPercent > 0 && this.$params.quest.progressPercent < 100) {
            imagePath = source.inProgress;
        } else {
            imagePath = source.finished;
        }

        return imagePath;
    }

    protected async openCasket(): Promise<void> {
        this.modalService.closeAllModals();
        this.$params.claimButtonParams.pending$.next(true);

        try {
            const result: IOpenRewardResponse = await this.questsService.openReward(this.$params.quest.id);

            if (result.bonus) {
                this.modalService.showModal(
                    this.$params.questTakePrizeModalConfig,
                    <IBonusChoiceModalCParams>{
                        bonus: result.bonus,
                        onConfirm: this.takeCasketPrizeHandler.bind(this),
                    },
                );

                this.$params.onClaimReward?.(this.$params.quest.id, result.newQuestStatus);
            }

            this.cdr.markForCheck();
        } catch (error) {
            this.showErrorMessage(error);
        } finally {
            this.$params.claimButtonParams.pending$.next(false);
        }
    }

    protected takeCasketPrizeHandler(): void {
        this.modalService.hideModal(this.$params.questTakePrizeModalConfig.id);
    }

    protected showErrorMessage(error?: any): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title: gettext('Error'),
                message: error?.errors || gettext('Something went wrong. Please try again later'),
            },
        });
    }
}
