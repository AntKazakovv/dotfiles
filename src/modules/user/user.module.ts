import {NgModule} from '@angular/core';
import {UserService} from './services/user.service';

@NgModule({
    providers: [
        UserService,
    ],
    exports: [
        UserService,
    ],
})
export class UserModule {
}
