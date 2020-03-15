import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DataService} from './services/data/data.service';
import {ConnectorService} from './services/connector/connector.service';

@NgModule({
    declarations: [

    ],
    providers: [
        DataService,
        ConnectorService
    ],
    imports: [
        CommonModule
    ]
})
export class WlcDataModule {
}
