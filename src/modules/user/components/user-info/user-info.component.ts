import {
    Component,
    Inject,
    OnInit,
    Input, ChangeDetectionStrategy, ElementRef,
} from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import {StateService, TransitionService} from '@uirouter/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services';
import * as Params from './user-info.params';

@Component({
    selector: '[wlc-user-info]',
    templateUrl: './user-info.component.html',
    styleUrls: ['./styles/user-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('toggle', [
            state('opened', style({
                opacity: 1,
                visibility: 'visible',
            })),
            state('closed', style({
                opacity: 0,
                visibility: 'hidden',
            })),
            transition('void => *', [
                animate(0),
            ]),
            transition('* => *', [
                animate('0.3s'),
            ]),
        ]),
    ],
})
export class UserInfoComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IUserInfoCParams;
    public $params: any;
    public isOpened: boolean;
    public dropdownBtnActive: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: any,
        protected configService: ConfigService,
        protected elementRef: ElementRef,
        protected transitionService: TransitionService,
        protected stateService: StateService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.transitionService.onEnter({}, () => {
            this.isOpened = false;
            this.dropdownBtnActive = false;
        });
    }

    public toggle(): void {
        this.isOpened = !this.isOpened;
        this.dropdownBtnActive = !this.dropdownBtnActive;
    }

    public depositAction(): void {
        this.stateService.go(this.$params.button.sref);
    }
}
