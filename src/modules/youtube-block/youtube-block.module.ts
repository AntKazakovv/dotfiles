import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {ThumbItemComponent} from './components/thumb-item/thumb-item.component';
import {ThumbListComponent} from './components/thumb-list/thumb-list.component';
import {ThumbsWrapperComponent} from './components/thumbs-wrapper/thumbs-wrapper.component';
import {VideoModalComponent} from './components/video-modal/video-modal.component';
import {YoutubeBlockService} from 'wlc-engine/modules/youtube-block/system/services/youtube-block.service';

export const components = {
    'wlc-thumb-item': ThumbItemComponent,
    'wlc-thumb-list': ThumbListComponent,
    'wlc-thumbs-wrapper': ThumbsWrapperComponent,
    'wlc-video-modal': VideoModalComponent,
};
export const services = {
    'youtube-block-service': YoutubeBlockService,
};

@NgModule({
    declarations: [
        ThumbItemComponent,
        ThumbListComponent,
        ThumbsWrapperComponent,
        VideoModalComponent,
    ],

    imports: [
        CommonModule,
        CoreModule,
        TranslateModule,
    ],
    providers: [
        YoutubeBlockService,
    ],
    exports: [
        ThumbItemComponent,
        ThumbListComponent,
        ThumbsWrapperComponent,
        VideoModalComponent,
    ],
})

export class YoutubeBlockModule {
}
