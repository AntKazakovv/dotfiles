import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';

// components
import {InternalMailsComponent} from './components/internal-mails/internal-mails.component';
import {
    ProfileMessagePreviewComponent,
} from 'wlc-engine/modules/internal-mails/components/internal-mails/components/mail-preview/mail-preview.component';
import {
    OpenMailBtnComponent,
} from 'wlc-engine/modules/internal-mails/components/internal-mails/components/open-mail-btn/open-mail-btn.component';
import {
    InternalMailsNotifierComponent,
} from 'wlc-engine/modules/internal-mails/components/internal-mails-notifier/internal-mails-notifier.component';
import {
    InternalMailsService,
} from 'wlc-engine/modules/internal-mails/system/services/internal-mails/internal-mails.service';


export const components = {
    'wlc-internal-mails': InternalMailsComponent,
    'wlc-internal-mails-notifier': InternalMailsNotifierComponent,
};

export const services = {
    'internal-mails-service': InternalMailsService,
};

@NgModule({
    declarations: [
        InternalMailsComponent,
        InternalMailsNotifierComponent,
        OpenMailBtnComponent,
        ProfileMessagePreviewComponent,
    ],
    imports: [
        CoreModule,
        TranslateModule,
    ],
})
export class InternalMailsModule {
}
