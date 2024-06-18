import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';

import * as Params from './quest-prizes-modal.params';

@Component({
    selector: '[wlc-quest-prizes-modal]',
    templateUrl: './quest-prizes-modal.component.html',
    styleUrls: ['./styles/quest-prizes-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class QuestPrizesModalComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IQuestPrizesModalCParams;

    public override $params: Params.IQuestPrizesModalCParams;
    public numbers: number[] = [];
    public selectedPrizeNumber: number;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IQuestPrizesModalCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        //[1,2,3,4,5]
        this.numbers = Array(this.$params.prizeCount).fill(0).map((_: number, i: number) => (i + 1));
    }

    public selectPrize(prizeNumber: number): void {
        this.selectedPrizeNumber = prizeNumber;
    }

    public async open(): Promise<void> {
        if (this.selectedPrizeNumber) {
            await this.$params.onClick?.();
        }
    }
}
