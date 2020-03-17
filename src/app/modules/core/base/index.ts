import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {FilterPipe} from './pipes/filter/filter.pipe';
import {HomeComponent} from './components/home/home.component';

@NgModule({
    declarations: [
        FilterPipe,
        HomeComponent
    ],
    exports: [
        FilterPipe,
        // HomeComponent
    ],
    imports: [
        CommonModule,
        UIRouterModule
    ]
})
export class WlcBaseModule {
}
