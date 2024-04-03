import {
    AfterViewInit,
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    ElementRef,
} from '@angular/core';
import {
    BehaviorSubject,
    fromEvent,
} from 'rxjs';
import {
    takeUntil,
    filter,
    map,
} from 'rxjs/operators';

import _merge from 'lodash-es/merge';

import {
    AbstractComponent,
    EventService,
    ConfigService,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';

import * as Params from './user-icon.params';

@Component({
    selector: 'div[wlc-user-icon], button[wlc-user-icon]',
    templateUrl: './user-icon.component.html',
    styleUrls: ['./styles/user-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UserIconComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @Input() protected inlineParams: Params.IUserIconCParams;
    public override $params: Params.IUserIconCParams;
    public showArrow: boolean;
    public avatarDef: boolean = false;

    protected useAvatar: boolean = this.configService.get<boolean>('$base.profile.nicknameIcon.use');

    constructor(
        @Inject('injectParams') protected injectParams: Params.IUserIconCParams,
        private elementRef: ElementRef,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
        protected eventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareParams();
    }

    public ngAfterViewInit(): void {
        if (this.$params.event) {
            fromEvent(this.elementRef.nativeElement, 'click')
                .pipe(takeUntil(this.$destroy))
                .subscribe(() => {
                    this.eventService.emit(this.$params.event);
                });
        }
    }

    protected prepareParams(): void {
        this.showArrow = this.elementRef.nativeElement.tagName === 'BUTTON' && this.$params.theme === 'default';

        if (this.useAvatar) {
            this.$params.showSvgAsImg = true;

            if (this.$params.theme === 'default') {
                this.avatarDef = true;
                this.addModifiers('avatar');
            }

            const defIcon: string = this.configService.get<string>('$base.profile.nicknameIcon.defaultIcon');
            this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'}).pipe(
                filter((v) => !!v),
                map((profile: UserProfile) => ({icon: profile.userIcon})),
                takeUntil(this.$destroy),
            ).subscribe((obj) => {
                const newIcon = !!obj.icon ? obj.icon : defIcon;
                this.$params.iconPath = newIcon;
                this.cdr.markForCheck();
            });

        } else if (this.$params.useDefaultAvatar && this.$params.theme !== 'default') {
            this.$params.iconPath = Params.defaultAvatar;
        }
        if (this.$params.showAsBtn) {
            this.$params.buttonParams = this.mergeButtonParams();
            this.cdr.detectChanges();
        }

    }

    protected mergeButtonParams(): IButtonCParams {
        return _merge(
            this.$params.buttonParams,
            Params.defaultButtonParams,
            {
                common: {
                    showIconAsImg: this.useAvatar,
                    iconPath: this.$params.iconPath,
                },
            },
        );
    }
}
