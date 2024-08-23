import {
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    Component,
    AfterViewInit,
    Input,
    Inject,
} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
    ModalService,
} from 'wlc-engine/modules/core';

import {YoutubeBlockService} from 'wlc-engine/modules/youtube-block/system/services';
import {IYoutubeVideoModel} from 'wlc-engine/modules/youtube-block/system/models/youtube-block.model';
import {VideoModalComponent} from 'wlc-engine/modules/youtube-block/components/video-modal/video-modal.component';
import {TVideoEvent} from '../../system/interfaces/youtube-block.interface';

import * as Params from './thumbs-wrapper.params';

@Component({
    selector: '[wlc-thumbs-wrapper]',
    templateUrl: './thumbs-wrapper.component.html',
    styleUrls: ['./styles/thumbs-wrapper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        YoutubeBlockService,
    ],
})
export class ThumbsWrapperComponent extends AbstractComponent implements AfterViewInit {
    @Input() protected inlineParams: Params.IThumbsWrapperCParams;

    public override $params: Params.IThumbsWrapperCParams;
    public items: IYoutubeVideoModel[] | null = null;
    public events$: Subject<TVideoEvent> = new Subject<TVideoEvent>();

    constructor(
        @Inject('injectParams') protected injectParams: Params.IThumbsWrapperCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
        protected youtubeBlockService: YoutubeBlockService,
        protected modalService: ModalService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, cdr);
        this.subscribeEvents();
    }

    public async ngAfterViewInit(): Promise<void> {
        this.items = await this.youtubeBlockService.getYoutubeVideos();
        this.cdr.markForCheck();
    }

    protected subscribeEvents(): void {
        this.events$.pipe(takeUntil(this.$destroy))
            .subscribe(event => {
                switch (event.name) {
                    case 'thumbClick':
                        this.showModal(event.data);
                        break;
                }
            });
    }

    protected showModal(thumb: IYoutubeVideoModel): void {
        this.modalService.showModal({
            id: 'youtube-modal',
            component: VideoModalComponent,
            componentParams: {
                thumb: thumb,
            },
            size: 'xxl',
            modalTitle: `${thumb.title}`,
            rejectBtnVisibility: false,
            centered: true,
            showFooter: false,
        });
    }
}
