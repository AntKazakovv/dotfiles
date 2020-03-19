import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DataService} from './services/data/data.service';
import {ConnectorService} from './services/connector/connector.service';

import {AppProvider} from './providers/app/app.provider';

@NgModule({
    declarations: [

    ],
    providers: [
        DataService,
        ConnectorService,
        AppProvider
    ],
    exports: [
    ],
    imports: [
        CommonModule
    ]
})
export class WlcDataModule {
}
