import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from '../core/core.module';
import {UserModule} from '../user/user.module';
import {TournamentsService} from './system/services';

export const components = {
};

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        CoreModule,
        UserModule,
        TranslateModule,
    ],
    providers: [
        TournamentsService,
    ],
    exports: [
    ],
})

export class TournamentsModule {
}
