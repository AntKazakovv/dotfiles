import {NgModule} from '@angular/core';
import {DeadsimplechatService} from './system/services/deadsimplechat.service';
import {DeadsimplechatComponent} from './components/deadsimplechat/deadsimplechat.component';
import {CoreModule} from 'wlc-engine/modules/core/core.module';

export const services = {
    'deadsimplechat-service': DeadsimplechatService,
};

export const components = {
    'wlc-deadsimplechat': DeadsimplechatComponent,
};

@NgModule({
    imports: [
        CoreModule,
    ],
    declarations: [
        DeadsimplechatComponent,
    ],
    providers: [
        DeadsimplechatService,
    ],
    exports: [
        DeadsimplechatComponent,
    ],
})
export class DeadsimplechatModule {}
