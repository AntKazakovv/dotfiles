import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {UIRouterModule} from "@uirouter/angular";
import {CoreModule} from "wlc-engine/modules/core/core.module";
export const components = {
};

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        TranslateModule,
        UIRouterModule,
        CoreModule,
    ],
    providers: [
    ],
    exports: [
    ],
})
export class ProfileModule {}
