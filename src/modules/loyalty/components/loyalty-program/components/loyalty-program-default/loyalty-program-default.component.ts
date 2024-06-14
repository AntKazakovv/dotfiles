import {
    Component,
    Inject,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';

import {
    BehaviorSubject,
    Observable,
} from 'rxjs';

import {
    AbstractComponent,
    IButtonCParams,
    ISlide,
    ISliderCParams,
} from 'wlc-engine/modules/core';
import {LoyaltyProgramController} from 'wlc-engine/modules/loyalty';

import * as Params from './loyalty-program-default.params';

@Component({
    selector: '[wlc-loyalty-program-default]',
    templateUrl: './loyalty-program-default.component.html',
    styleUrls: ['./styles/loyalty-program-default.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyProgramDefaultComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILoyaltyProgramDefaultCParams;

    public override $params: Params.ILoyaltyProgramDefaultCParams;
    public title!: string;
    public levelsLimit!: number;
    public decorLeftPath!: string;
    public decorRightPath!: string;
    public slides$!: BehaviorSubject<ISlide[] | null>;
    public isMobile$!: Observable<boolean>;
    public readMore!: () => void;
    public emptyStateText!: string;
    public sliderParams!: ISliderCParams;
    public btnParams!: IButtonCParams;

    protected readonly $ctrl: LoyaltyProgramController = inject(LoyaltyProgramController);
    protected useNavigation!: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.ILoyaltyProgramDefaultCParams,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.title = this.$ctrl.$props.title;
        this.levelsLimit = this.$ctrl.$props.levelsLimit;
        this.emptyStateText = this.$ctrl.$props.emptyStateText;
        this.decorLeftPath = this.$ctrl.$props.decorLeftPath;
        this.decorRightPath = this.$ctrl.$props.decorRightPath;
        this.readMore = () => this.$ctrl.readMore();
        this.slides$ = this.$ctrl.slides$;
        this.isMobile$ = this.$ctrl.isMobile$;
        this.useNavigation = this.$ctrl.$props.useNavigation ?? this.$params.useNavigation;
        this.sliderParams = this.$ctrl.getSliderParams(this.$params.sliderParams, this.useNavigation);
        this.btnParams = this.$ctrl.getBtnParams(this.$params.btnParams);
    }
}
