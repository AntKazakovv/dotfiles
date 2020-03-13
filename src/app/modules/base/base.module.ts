import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterPipe} from './pipes/filter/filter.pipe';

@NgModule({
    declarations: [
        FilterPipe
    ],
    imports: [
        CommonModule
    ]
})
export class BaseModule {
}
