import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {UIRouterModule} from '@uirouter/angular';
import {AngularResizeEventModule} from 'angular-resize-event';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {IconListComponent} from 'wlc-engine/modules/icon-list/components/icon-list/icon-list.component';
import {IconListItemComponent} from 'wlc-engine/modules/icon-list/components/icon-list-item/icon-list-item.component';
import {
    IconMerchantsListComponent,
} from 'wlc-engine/modules/icon-list/components/icon-merchants-list/icon-merchants-list.component';
import {
    IconPaymentsListComponent,
} from 'wlc-engine/modules/icon-list/components/icon-payments-list/icon-payments-list.component';
import {
    IconSafetyListComponent,
} from 'wlc-engine/modules/icon-list/components/icon-safety-list/icon-safety-list.component';

export const components = {
    'wlc-icon-list': IconListComponent,
    'wlc-icon-list-item': IconListItemComponent,
    'wlc-icon-merchants-list': IconMerchantsListComponent,
    'wlc-icon-payments-list': IconPaymentsListComponent,
    'wlc-icon-safety-list': IconSafetyListComponent,
};

@NgModule({
    declarations: [
        IconListComponent,
        IconListItemComponent,
        IconMerchantsListComponent,
        IconPaymentsListComponent,
        IconSafetyListComponent,
    ],
    imports: [
        UIRouterModule,
        CommonModule,
        CoreModule,
        AngularResizeEventModule,
        TranslateModule,
    ],
    exports: [
        IconListComponent,
        IconListItemComponent,
        IconMerchantsListComponent,
        IconPaymentsListComponent,
        IconSafetyListComponent,
    ],
})
export class IconListModule {}
