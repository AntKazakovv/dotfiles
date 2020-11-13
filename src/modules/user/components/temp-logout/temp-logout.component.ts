import {Component} from '@angular/core';
import {UserService} from 'wlc-engine/modules/user/services/user.service';
import {ConfigService} from 'wlc-engine/modules/core/services';

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
