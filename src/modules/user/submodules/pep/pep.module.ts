import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';

// components
import {
    PepConfirmPasswordFormComponent,
} from
    'wlc-engine/modules/user/submodules/pep/components/pep-confirm-password-form/pep-confirm-password-form.component';
import {PepInfoComponent} from 'wlc-engine/modules/user/submodules/pep/components/pep-info/pep-info.component';
import {PepSavedComponent} from 'wlc-engine/modules/user/submodules/pep/components/pep-saved/pep-saved.component';
import {PepSelectComponent} from 'wlc-engine/modules/user/submodules/pep/components/pep-select/pep-select.component';

// services
import {PepService} from 'wlc-engine/modules/user/submodules/pep/system/services/pep/pep.service';

export const components = {
    'wlc-pep-confirm-password-form': PepConfirmPasswordFormComponent,
    'wlc-pep-info': PepInfoComponent,
    'wlc-pep-saved': PepSavedComponent,
    'wlc-pep-select': PepSelectComponent,
};

export const services = {
    'pep-service': PepService,
};

@NgModule({
    declarations: [
        PepConfirmPasswordFormComponent,
        PepInfoComponent,
        PepSavedComponent,
        PepSelectComponent,
    ],
    imports: [
        CoreModule,
        TranslateModule,
    ],
})
export class PepModule {
}
