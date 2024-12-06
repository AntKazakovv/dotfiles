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
import {BehaviorSubject} from 'rxjs';

import {
    AbstractComponent,
    EventService,
    IButtonCParams,
    IModalConfig,
    InjectionService,
    IPushMessageParams,
    ITimerCParams,
    ModalService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {
    IQuestPrizesModalCParams,
    QuestModel,
    QuestsService,
    QuestStatusEnum,
} from 'wlc-engine/modules/quests';
import {
    Bonus,
    BonusesService,
    IBonusChoiceModalCParams,
    IBonusModalCParams,
    IConfirmImprovementModalCParams,
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
    public ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public progressText: string;
    public showTimer: boolean = false;
    public statusImagePath: string;
    public statusImageFallbackPath: string;
    public questProgress: string;

    protected injectionService: InjectionService = inject(InjectionService);
    protected modalService: ModalService = inject(ModalService);
    protected eventService: EventService = inject(EventService);
    protected questsService: QuestsService = inject(QuestsService);
    protected bonusesService: BonusesService;
    protected questTakePrizeModalConfig: IModalConfig;
    protected cursor$: BehaviorSubject<Params.CursorEnum> = new BehaviorSubject(Params.CursorEnum.POINTER);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IQuestProgressCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.quest) {
            this.init().finally((): void => {
                this.ready$.next(true);
            });
        }
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);

        if (this.$params && changes['inlineParams']?.currentValue?.quest) {
            this.init().finally((): void => {
                this.cdr.markForCheck();
            });
        }
    }

    public updateQuestsDataHandler(): void {
        this.questsService.queryQuests({withModifier: true});
    }

    public async showBonusInfoHandler(): Promise<void> {
        this.cursor$.next(Params.CursorEnum.WAIT);
        const rewardBonus: Bonus = await this.getBonus(this.quest.idBonus);

        if (rewardBonus) {
            this.modalService.showModal('bonusModal', {
                bonus: rewardBonus,
                hideBonusButtons: true,
            } as IBonusModalCParams);
        }

        this.cursor$.next(Params.CursorEnum.POINTER);
    }

    public claimReward(): void {
        this.$params.claimButtonParams.pending$.next(true);

        if (this.quest.isCompletedStatus) {
            this.modalService.showModal(this.$params.questPrizesModalConfig, {
                quest: this.$params.quest,
                onSubmit: this.openTheChest.bind(this, this.$params.questPrizesModalConfig.id),
            } as IQuestPrizesModalCParams).finally((): void => {
                this.$params.claimButtonParams.pending$.next(false);
            });
        } else if (this.quest.isOpenedStatus) {
            this.getBonus(this.quest.rewardedBonusId).then((bonus: Bonus): void => {
                this.openModalWithQuestReward(bonus);
            }).finally((): void => {
                this.$params.claimButtonParams.pending$.next(false);
            });
        }
    }

    public get quest(): QuestModel {
        return this.$params.quest;
    }

    public get timerParams(): ITimerCParams {
        return this.$params.timerParams;
    }

    public get pathToLeftImage(): string {
        return this.$params.pathToLeftImage;
    }

    public get pathToLeftImageFallback(): string {
        return this.$params.pathToLeftImageFallback;
    }

    public get claimButtonParams(): IButtonCParams {
        return this.$params.claimButtonParams;
    }

    public get claimDatePrefixText(): string {
        return this.$params.claimDatePrefixText;
    }

    public get claimButtonDisabled(): boolean {
        return this.quest.isNotCompletedStatus || this.quest.isFinishedStatus;
    }

    protected async init(): Promise<void> {
        this.showTimer = this.quest.renewalTime > dayjs();
        this.progressText = `${this.quest.progressReady} / ${this.quest.progressTotal}`;
        this.questProgress = this.quest.progressPercent + '%';

        this.statusImagePath = this.getStatusImage(false);
        this.statusImageFallbackPath = this.getStatusImage(true);

        if (this.quest.isCompletedStatus || this.quest.isOpenedStatus) {
            this.addModifiers('completed');
        } else {
            this.removeModifiers('completed');
        }
    }

    protected getStatusImage(fallback: boolean = false): string {
        let imagePath: string = '';
        const source: Params.IQuestStatusImages = fallback
            ? this.$params.pathsToQuestStatusFallbackImages
            : this.$params.pathsToQuestStatusImages;

        if (this.quest.progressPercent === 0) {
            imagePath = source.noProgress;
        } else if (this.quest.progressPercent > 0 && this.quest.progressPercent < 100) {
            imagePath = source.inProgress;
        } else {
            imagePath = source.finished;
        }

        return imagePath;
    }

    protected async openTheChest(currentModalId: string): Promise<void> {
        try {
            const bonus: Bonus = await this.questsService.openReward(this.quest.id);
            this.openModalWithQuestReward(bonus);
            this.$params.updateQuestData(this.quest.id, {
                Status: QuestStatusEnum.OPENED,
                Progress: {
                    ...this.quest.data.Progress,
                    Bonus: bonus.id,
                },
            });
        } catch (error) {
            this.showErrorMessage(error);
        } finally {
            if (currentModalId) {
                this.modalService.hideModal(currentModalId);
            }
        }
    }

    protected openModalWithQuestReward(bonus: Bonus): void {
        this.questTakePrizeModalConfig = {
            ...this.$params.questTakePrizeModalConfig,
            componentParams: {
                ...(this.$params.questTakePrizeModalConfig.componentParams as Object ?? {}),
                bonus: bonus,
                onTakeImproved: async (bonus: Bonus): Promise<void> => {
                    await this.takeImprovedBonus(bonus, this.$params.questTakePrizeModalConfig.id);
                },
                onTakeBase: async (bonus: Bonus): Promise<void> => {
                    await this.takeBonus(bonus, this.$params.questTakePrizeModalConfig.id);
                },
            } as IBonusChoiceModalCParams,
        };
        this.modalService.showModal(this.questTakePrizeModalConfig);
    }

    protected async takeImprovedBonus(improvementBonus: Bonus, currentModalId?: string): Promise<void> {
        this.modalService.hideModal(currentModalId);
        const modalConfig: IModalConfig = this.getConfirmImprovementModalConfig(improvementBonus);
        await this.modalService.showModal(modalConfig);
    }

    protected async takeBonus(baseBonus: Bonus, currentModalId?: string): Promise<void> {
        await this.questsService.takeReward(this.quest.id, baseBonus.id.toString())
            .then((bonusTakenAt: string): void => {
                this.showSuccessMessage(gettext('The bonus has been taken successfully'));
                this.$params.updateQuestData(this.quest.id, {
                    Status: QuestStatusEnum.FINISHED,
                    BonusTakenAt: bonusTakenAt,
                });
            })
            .catch((error): void => {
                this.showErrorMessage(error);
            })
            .finally((): void => {
                if (currentModalId) {
                    this.modalService.hideModal(currentModalId);
                }
            });
    }

    protected showErrorMessage(error?: any): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: {
                type: 'error',
                title: gettext('Error'),
                message: error?.errors || gettext('Something went wrong. Please try again later'),
            } as IPushMessageParams,
        });
    }

    protected showSuccessMessage(message: string | string[], title: string = gettext('Bonus success')): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: {
                type: 'success',
                title,
                message,
                wlcElement: 'notification_bonus-success',
            } as IPushMessageParams,
        });
    }

    protected getConfirmImprovementModalConfig(improvementBonus: Bonus): IModalConfig {
        return {
            ...this.$params.confirmImprovementBonusModalConfig,
            componentParams: {
                ...(this.$params.confirmImprovementBonusModalConfig.componentParams as Object ?? {}),
                bonus: improvementBonus,
                onConfirm: async (bonus: Bonus): Promise<void> => {
                    await this.takeBonus(bonus, this.$params.confirmImprovementBonusModalConfig.id);
                },
                onReject: async (): Promise<void> => {
                    this.modalService.hideModal(this.$params.confirmImprovementBonusModalConfig.id);
                    await this.modalService.showModal(this.questTakePrizeModalConfig);
                },
            } as IConfirmImprovementModalCParams,
        };
    }

    protected async getBonus(bonusId: number): Promise<Bonus> {
        this.bonusesService ??= await this.injectionService.getService<BonusesService>('bonuses.bonuses-service');
        return this.bonusesService.getBonus(bonusId, {cache: 60 * 1000});
    }
}
