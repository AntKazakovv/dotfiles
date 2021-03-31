import {
    Component,
    OnInit,
    Input,
    Inject,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DateTime} from 'luxon';
import {ModalService} from 'wlc-engine/modules/core';
import {
    AbstractComponent,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {UserService} from 'wlc-engine/modules/user/system/services';

import * as Params from './reality-check-info.params';

@Component({
    selector: '[wlc-reality-check-info]',
    templateUrl: './reality-check-info.component.html',
    styleUrls: ['./styles/reality-check-info.component.scss'],
})
export class RealityCheckInfoComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.IRealityCheckInfoCParams;
    public $params: Params.IRealityCheckInfoCParams;
    public playTime: string;
    public showClose: boolean = false;
    public checkBoxParams = {
        name: 'i-have-seen',
        text: gettext('I have seen this message'),
        textSide: 'right',
        control: new FormControl(),
        onChange: (checked: boolean) => {
            this.showClose = checked;
        },
    };

    constructor(
        @Inject('injectParams') protected params: Params.IRealityCheckInfoCParams,
        protected userService: UserService,
        protected modalService: ModalService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        const t = DateTime.fromFormat(this.$params.FromTime, 'yyyy-LL-dd HH:mm:ss');
        this.playTime = DateTime.fromFormat(this.$params.FromTime, 'yyyy-LL-dd HH:mm:ss').diffNow().toFormat('hh:mm:ss');
    }

    public close(): void {
        this.modalService.hideModal('reality-check-info');
    }

    public async logout(): Promise<void> {
        try {
            await this.userService.logout();
        } catch (error) {
            //
        }
    }
}
