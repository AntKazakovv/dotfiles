import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Inject,
    ChangeDetectionStrategy,
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

@Component({
    selector: '[wlc-reality-check-info]',
    templateUrl: './reality-check-info.component.html',
    styleUrls: ['./styles/reality-check-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    protected dateRegExp = /(?<y>\d{4})-(?<m>\d{1,2})-(?<d>\d{1,2}) (?<hour>\d{1,2}):(?<min>\d{1,2}):(?<sec>\d{1,2})/;

    constructor(
        @Inject('injectParams') protected params: Params.IRealityCheckInfoCParams,
        protected userService: UserService,
        protected modalService: ModalService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.playTime = DateTime.fromJSDate(this.getLocalDate()).toFormat('yyyy-LL-dd HH:mm:ss');
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        if (!this.showClose) {
            this.logout();
        }
    }

    public close(): void {
        if (this.modalService.getActiveModal('reality-check-info')) {
            this.modalService.hideModal('reality-check-info');
        }
    }

    public logout(): void {
        try {
            this.userService.logout();
            this.close();
        } catch (error) {
            //
        }
    }

    protected getLocalDate(): Date {
        const date: Date = this.getDateFromString();
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date;
    }

    protected getDateFromString(): Date {
        const dateGroups = this.$params.FromTime.match(this.dateRegExp).groups;
        const dateInfo = {
            year: Number(dateGroups.y),
            month: Number(dateGroups.m) - 1,
            day: Number(dateGroups.d),
            hour: Number(dateGroups.hour),
            min: Number(dateGroups.min),
            sec: Number(dateGroups.sec),
        };
        return new Date(dateInfo.year, dateInfo.month, dateInfo.day, dateInfo.hour, dateInfo.min, dateInfo.sec);
    }
}
