import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainMenuComponent} from './components/main-menu/main-menu.component';
import {UIRouterModule} from '@uirouter/angular';
import {TranslateModule} from '@ngx-translate/core';

export const components = {
    'wlc-main-menu': MainMenuComponent,
};

@NgModule({
    declarations: [MainMenuComponent],
    id: 'MenuModule',
    imports: [
        CommonModule,
        TranslateModule,
        UIRouterModule,
    ]
})
export class MenuModule {
}
