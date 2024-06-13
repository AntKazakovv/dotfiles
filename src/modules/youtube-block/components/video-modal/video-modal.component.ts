import {
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
    AfterViewInit,
} from '@angular/core';

import {
    SafeResourceUrl,
} from '@angular/platform-browser';

import {
    AbstractComponent,
    ConfigService,
    DomSanitizerService,
} from 'wlc-engine/modules/core';

import * as Params from './video-modal.params';

@Component({
    selector: '[wlc-video-modal]',
    templateUrl: './video-modal.component.html',
    styleUrls: ['./styles/video-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoModalComponent extends AbstractComponent implements OnInit, AfterViewInit {
    public videoId: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IVideoModalCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected domSanitizerService: DomSanitizerService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public ngAfterViewInit(): void {
        this.videoId = this.injectParams.thumb.videoId;
        this.cdr.markForCheck();
    }

    public get url(): SafeResourceUrl {
        const _url = `https://www.youtube.com/embed/${this.injectParams.thumb.videoId}?autoplay=1`;
        return this.domSanitizerService
            .bypassSecurityTrustResourceUrl(_url);
    }
}
