import {
    Component,
    Inject,
    OnInit,
    Input,
    AfterViewInit,
    ViewContainerRef,
    ViewChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {StateService, UIRouterGlobals} from '@uirouter/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {StaticService, TextDataModel} from 'wlc-engine/modules/static';
import {IPostComponentParams} from './post.interface';
import {defaultParams} from './post.params';
import {ConfigService} from 'wlc-engine/modules/core';

import {
    isFunction as _isFunction,
} from 'lodash-es';


export * from './post.interface';

@Component({
    selector: '[wlc-post]',
    templateUrl: './post.component.html',
    styleUrls: ['./styles/post.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @ViewChild('wrp', {read: ViewContainerRef, static: true}) wrp: ViewContainerRef;
    @Input() protected slug: string;
    public data: TextDataModel;
    public html: string;
    public isReady: boolean = false;

    constructor(
        @Inject('injectParams') protected params: IPostComponentParams,
        protected staticService: StaticService,
        protected viewRef: ViewContainerRef,
        protected domSanitizer: DomSanitizer,
        protected cdr: ChangeDetectorRef,
        protected uiRouter: UIRouterGlobals,
        protected configService: ConfigService,
        protected stateService: StateService,
    ) {
        super({injectParams: params, defaultParams});
    }

    async ngOnInit(): Promise<void> {
        super.ngOnInit();

        try {
            const slug = this.slug || this.params.slug || this.uiRouter.params.slug;

            let data: TextDataModel;
            if (this.configService.get<string[]>({name: '$static.pages'}).includes(slug)) {
                data = await this.staticService.getPage(slug);
            } else {
                data = await this.staticService.getPost(slug);
            }

            this.html = this.domSanitizer.bypassSecurityTrustHtml(data.html)?.['changingThisBreaksApplicationSecurity'];

            if (_isFunction(this.params.setTitle)) {
                this.params.setTitle(data.title);
            }
        } catch (e) {
            // TODO: redirect on 404 page
            this.stateService.go('app.home');

            console.error(e);
        } finally {
            this.isReady = true;
            this.cdr.markForCheck();
        }
    }

    ngAfterViewInit() {
        this.viewRef.remove();
    }
}
