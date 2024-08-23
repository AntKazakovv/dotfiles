import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
} from '@angular/core';

import {
    DomSanitizer,
    SafeResourceUrl,
} from '@angular/platform-browser';

import {AbstractComponent} from 'wlc-engine/modules/core';

import * as Params from './video-modal.params';

@Component({
    selector: '[wlc-video-modal]',
    templateUrl: './video-modal.component.html',
    styleUrls: ['./styles/video-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoModalComponent extends AbstractComponent implements OnInit {
    public videoId: string = this.injectParams.thumb.videoId;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IVideoModalCParams,
        protected sanitizer: DomSanitizer,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public get url(): SafeResourceUrl {
        const _url = `https://www.youtube.com/embed/${this.injectParams.thumb.videoId}?autoplay=1`;
        return this.sanitizer
            .bypassSecurityTrustResourceUrl(_url);
    }
}
