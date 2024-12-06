import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses';

import * as Params from './bonus-choice-modal.params';

@Component({
    selector: '[wlc-bonus-choice-modal]',
    templateUrl: './bonus-choice-modal.component.html',
    styleUrls: ['./styles/bonus-choice-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonusChoiceModalComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IBonusChoiceModalCParams;

    public override $params: Params.IBonusChoiceModalCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBonusChoiceModalCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public onTakeImproved(): void {
        this.$params.improveBtnParams.pending$.next(true);
        this.$params.onTakeImproved(this.improvementBonus).finally((): void => {
            this.$params.improveBtnParams.pending$.next(false);
        });
    }

    public onTakeBase(): void {
        this.$params.takeBtnParams.pending$.next(true);
        this.$params.onTakeBase(this.bonus).finally((): void => {
            this.$params.improveBtnParams.pending$.next(false);
        });
    }

    public get bonus(): Bonus {
        return this.$params.bonus;
    }

    public get improvementBonus(): Bonus {
        return this.$params.bonus.improvementBonus;
    }

    public get title(): string {
        return this.$params.title;
    }

    public get headerMessage(): string {
        return this.$params.headerMessage;
    }

    public get image(): string {
        return this.$params.image;
    }

    public get imageFallback(): string {
        return this.$params.imageFallback;
    }

    public get improveBtnParams(): IButtonCParams {
        return this.$params.improveBtnParams;
    }

    public get takeBtnParams(): IButtonCParams {
        return this.$params.takeBtnParams;
    }
}
