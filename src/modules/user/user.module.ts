import {NgModule} from '@angular/core';
import {UserService} from './services/user.service';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {CommonModule} from '@angular/common';

// Components
import {LoginSignupComponent} from './components/login-signup/login-signup.component';

export const components = {
    'wlc-login-signup': LoginSignupComponent,
};

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        CoreModule,
    ],
    providers: [
        UserService,
    ],
    exports: [
        UserService,
    ],
    declarations: [
        LoginSignupComponent,
    ],
})
export class UserModule {
}
