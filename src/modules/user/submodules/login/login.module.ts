import {NgModule} from '@angular/core';
import {UIRouterModule} from '@uirouter/angular';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {SignInFormComponent} from './components/sign-in-form/sign-in-form.component';
import {RestorePasswordFormComponent} from './components/restore-password-form/restore-password-form.component';
import {RestoreLinkComponent} from './components/restore-link/restore-link.component';

export const components = {
    'wlc-sign-in-form': SignInFormComponent,
    'wlc-restore-password-form': RestorePasswordFormComponent,
    'wlc-restore-link': RestoreLinkComponent,
};

@NgModule({
    declarations: [
        SignInFormComponent,
        RestorePasswordFormComponent,
        RestoreLinkComponent,
    ],
    imports: [
        CoreModule,
        UIRouterModule,
    ],
    exports: [
        SignInFormComponent,
        RestorePasswordFormComponent,
    ],
})
export class LoginModule {
}
