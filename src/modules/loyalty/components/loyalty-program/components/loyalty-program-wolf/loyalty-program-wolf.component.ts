import {
    Component,
    Inject,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import {
    AbstractComponent,
    IButtonCParams,
    ISlide,
    ISliderCParams,
} from 'wlc-engine/modules/core';
import {LoyaltyProgramController} from 'wlc-engine/modules/loyalty';

import * as Params from './loyalty-program-wolf.params';

@Component({
    selector: '[wlc-loyalty-program-wolf]',
    templateUrl: './loyalty-program-wolf.component.html',
    styleUrls: ['./styles/loyalty-program-wolf.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyProgramWolfComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILoyaltyProgramWolfCParams;

    public override $params: Params.ILoyaltyProgramWolfCParams;
    public title!: string;
    public slides$!: BehaviorSubject<ISlide[] | null>;
    public readMore!: () => void;
    public emptyStateText!: string;
    public sliderParams!: ISliderCParams;
    public btnParams!: IButtonCParams;
    public navigationId!: string;

    protected readonly $ctrl: LoyaltyProgramController = inject(LoyaltyProgramController);
    protected useNavigation!: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.ILoyaltyProgramWolfCParams,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.title = this.$ctrl.$props.title;
        this.emptyStateText = this.$ctrl.$props.emptyStateText;
        this.readMore = () => this.$ctrl.readMore();
        this.slides$ = this.$ctrl.slides$;
        this.useNavigation = this.$ctrl.$props.useNavigation ?? this.$params.useNavigation;
        this.sliderParams = this.$ctrl.getSliderParams(this.$params.sliderParams, this.useNavigation);
        this.btnParams = this.$ctrl.getBtnParams(this.$params.btnParams);
        this.navigationId = this.$ctrl.navigationId;
    }
}
