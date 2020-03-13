import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ModalService} from './services/modal/modal.service';

@NgModule({
    declarations: [

    ],
    providers: [
        ModalService
    ],
    imports: [
        CommonModule
    ]
})
export class WlcModalModule {
}
