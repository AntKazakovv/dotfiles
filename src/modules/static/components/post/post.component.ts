import {
    Component,
    Inject,
    OnInit,
    Input,
    AfterViewInit,
    ViewContainerRef,
    ViewChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {StaticService} from 'wlc-engine/modules/static';
import {IPostComponentParams} from 'wlc-engine/modules/static/components/post/post.interface';
import {TextDataModel} from 'wlc-engine/modules/static';

@Component({
    selector: '[wlc-post]',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @ViewChild('wrp', {read: ViewContainerRef, static: true}) wrp: ViewContainerRef;
    @Input() protected slug: string;
    public data: TextDataModel;

    public html: SafeHtml;
    public isReady: boolean;

    constructor(
        protected staticService: StaticService,
        @Inject('params') protected params: IPostComponentParams,
        protected viewRef: ViewContainerRef,
        protected domSanitizer: DomSanitizer,
        private cdr: ChangeDetectorRef,
    ) {
        super(params);
    }

    async ngOnInit(): Promise<void> {
        try {
            const data: TextDataModel = await this.staticService.getPost(this.slug || this.params.slug);
            // const html = this.domSanitizer.bypassSecurityTrustHtml(data.html);
            this.html = data.html;
            this.isReady = true;
            this.cdr.detectChanges();
        } catch (e) {
        }
        // this.wrp.remove();
        // this.viewRef.remove();
    }

    ngAfterViewInit() {
        // this.wrp.remove();
        // this.viewRef.remove();
    }

}
