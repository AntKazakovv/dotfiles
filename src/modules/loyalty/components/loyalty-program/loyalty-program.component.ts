import {
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    inject,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {
    LoyaltyProgramController,
    TComponent,
} from 'wlc-engine/modules/loyalty/components/loyalty-program/controllers/loyalty-program.controller';

import * as Params from './loyalty-program.params';

@Component({
    selector: '[wlc-loyalty-program]',
    templateUrl: './loyalty-program.component.html',
    styleUrls: ['./styles/loyalty-program.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [LoyaltyProgramController],
})
export class LoyaltyProgramComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILoyaltyProgramCParams;

    public override $params: Params.ILoyaltyProgramCParams;
    public ready$: BehaviorSubject<boolean>;
    public $component: TComponent;

    protected readonly $ctrl: LoyaltyProgramController = inject(LoyaltyProgramController);

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyProgramCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.ready$ = this.$ctrl.ready$;

        this.$ctrl.init({
            theme: this.$params.theme,
            title: this.$params.title ?? this.configService.get<string>('$loyalty.loyalty.programTitle'),
            decorLeftPath: this.$params.decorLeftPath,
            decorRightPath: this.$params.decorRightPath,
            levelsLimit: this.$params.levelsLimit,
            emptyStateText: this.$params.emptyStateText,
            sliderParams: this.$params.sliderParams,
            useNavigation: this.$params.useNavigation,
            btnParams: this.$params.btnParams,
        });

        this.$component = this.$ctrl.$component;
    }
}
