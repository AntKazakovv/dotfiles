import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Inject,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {DateTime} from 'luxon';
import {ICheckboxCParams} from 'wlc-engine/modules/core/components/checkbox/checkbox.params';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {
    AbstractComponent,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './reality-check-info.params';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-reality-check-info]',
    templateUrl: './reality-check-info.component.html',
    styleUrls: ['./styles/reality-check-info.component.scss'],
})
export class RealityCheckInfoComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() public inlineParams: Params.IRealityCheckInfoCParams;
    public override $params: Params.IRealityCheckInfoCParams;
    public playTime: string;
    public showClose: boolean = false;
    public checkBoxParams: ICheckboxCParams = {
        name: 'i-have-seen',
        text: gettext('I have seen this message'),
        textSide: 'right',
        control: new UntypedFormControl(),
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

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.playTime = DateTime.fromJSDate(new Date(this.$params.FromTime + ' UTC')).toFormat('yyyy-LL-dd HH:mm:ss');
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        if (!this.showClose) {
            this.logout();
        }
    }

    public close(): void {
        this.modalService.hideModal('reality-check-info');
    }

    public logout(): void {
        try {
            this.userService.logout();
        } catch (error) {
            //
        }
    }
}
