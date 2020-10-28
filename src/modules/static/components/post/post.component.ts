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

import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {StaticService} from 'wlc-engine/modules/static';
import {IPostComponentParams} from 'wlc-engine/modules/static/components/post/post.interface';
import {TextDataModel} from 'wlc-engine/modules/static';
import {defaultParams} from './post.params';

@Component({
    selector: '[wlc-post]',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @ViewChild('wrp', {read: ViewContainerRef, static: true}) wrp: ViewContainerRef;
    @Input() protected slug: string;
    public data: TextDataModel;
    public html: string;
    public isReady: boolean;

    constructor(
        protected staticService: StaticService,
        @Inject('injectParams') protected params: IPostComponentParams,
        protected viewRef: ViewContainerRef,
        protected domSanitizer: DomSanitizer,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams: params, defaultParams});
    }

    async ngOnInit(): Promise<void> {
        super.ngOnInit();

        try {
            const data: TextDataModel = await this.staticService.getPost(this.slug || this.params.slug);
            this.html = this.domSanitizer.bypassSecurityTrustHtml(data.html)?.['changingThisBreaksApplicationSecurity'];
            this.cdr.markForCheck();
        } catch (e) {
            console.log(e);
        } finally {
            this.isReady = true;
        }
    }

    ngAfterViewInit() {
        this.viewRef.remove();
    }
}
