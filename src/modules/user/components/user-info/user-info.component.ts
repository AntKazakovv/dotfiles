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
import {StateService} from '@uirouter/core';
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

    constructor(
        @Inject('injectParams') protected injectParams: any,
        protected configService: ConfigService,
        protected elementRef: ElementRef,
        protected stateService: StateService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public toggle(): void {
        this.isOpened = !this.isOpened;
    }

    public depositAction(): void {
        this.stateService.go('app.profile.cash.deposit');
    }
}
