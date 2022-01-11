import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ElementRef,
    ChangeDetectorRef,
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
import {ConfigService, EventService} from 'wlc-engine/modules/core/system/services';
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
    public $params: Params.IUserInfoCParams;
    public isOpened: boolean;
    public dropdownBtnActive: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IUserInfoCParams,
        protected configService: ConfigService,
        protected elementRef: ElementRef,
        protected stateService: StateService,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        if (this.configService.get<boolean>('$base.stickyHeader.use')) {
            this.$params = Params.stickyThemeParams;
        };
        this.eventService.subscribe({name: 'TRANSITION_ENTER'}, () => {
            this.isOpened = false;
            this.dropdownBtnActive = false;
            this.cdr.markForCheck();
        }, this.$destroy);
    }

    public toggle(): void {
        this.isOpened = !this.isOpened;
        this.dropdownBtnActive = !this.dropdownBtnActive;
    }

    public depositAction(): void {
        this.stateService.go(this.$params.button.sref);
    }
}
