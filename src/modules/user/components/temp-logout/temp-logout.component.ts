import {Component} from '@angular/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {ConfigService} from 'wlc-engine/modules/core/system/services';

@Component({
    selector: '[wlc-temp-logout]',
    templateUrl: './temp-logout.component.html',
    styleUrls: ['./temp-logout.component.scss'],
})
export class TempLogoutComponent {

    constructor(
        protected userService: UserService,
        protected configService: ConfigService,
    ) {
    }

    public logout(): void {
        this.userService.logout();
    }
}
