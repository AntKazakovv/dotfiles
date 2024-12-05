import {
    Component,
    OnInit,
    Inject,
    Renderer2,
    ChangeDetectionStrategy,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {
    BehaviorSubject,
    combineLatest,
} from 'rxjs';
import {
    first, 
    takeUntil,
} from 'rxjs/operators';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {SocialService} from 'wlc-engine/modules/user/system/services/social/social.service';
import {CoreModule} from 'wlc-engine/modules/core/core.module';

import * as Params from './google-one-tap.params';

@Component({
    selector: '[wlc-google-one-tap]',
    templateUrl: './google-one-tap.component.html',
    standalone: true,
    imports: [CoreModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleOneTapComponent extends AbstractComponent implements OnInit {
    public clientId$ = new BehaviorSubject<string | null>(null);
    public override $params: Params.IGoogleOneTapCParams;

    public get loginUri(): string {
        // @ts-ignore no-implicit-any #672571
        return this.$params.loginUri;
    }

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGoogleOneTapCParams,
        protected socialService: SocialService,
        protected renderer2: Renderer2,
        @Inject(DOCUMENT) protected document: Document,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }


    public override ngOnInit(): void {
        super.ngOnInit(this.injectParams);

        combineLatest([
            this.configService.get<BehaviorSubject<boolean>>('$user.isAuth$').asObservable(),
            this.socialService.isRegistrationOngoing$,
        ])
            .pipe(first())
            .subscribe(([isAuthenticated, isRegistrationProcess]) => {
                if (!isAuthenticated && !isRegistrationProcess) {
                    this.socialService.getClientId('gp')
                        .pipe(takeUntil(this.$destroy))
                        .subscribe((clientId: string) => {
                            this.clientId$.next(clientId);
                            this.renderer2.appendChild(
                                this.document.body,
                                // @ts-ignore no-implicit-any #672571
                                this.createScriptElement(this.$params['otScriptUrl']),
                            );
                        });
                }
            });
    }

    protected createScriptElement(src: string): HTMLScriptElement {
        const scriptElement = this.renderer2.createElement('script');
        scriptElement.src = src;
        scriptElement.async = 'true';
        return scriptElement;
    }
}
