import {
    Component,
    OnInit,
    Inject,
    Renderer2,
    ChangeDetectionStrategy,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {BehaviorSubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

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

        if (!this.configService.get<boolean>('$user.isAuthenticated')) {
            this.socialService.getClientId('gp').pipe(takeUntil(this.$destroy)).subscribe((clientId: string) => {
                this.clientId$.next(clientId);
                this.renderer2.appendChild(
                    this.document.body,
                    this.createScriptElement(this.$params['otScriptUrl']),
                );
            });
        }
    }

    protected createScriptElement(src: string): HTMLScriptElement {
        const scriptElement = this.renderer2.createElement('script');
        scriptElement.src = src;
        scriptElement.async = 'true';
        return scriptElement;
    }
}
