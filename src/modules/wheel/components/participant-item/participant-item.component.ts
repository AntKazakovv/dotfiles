import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnChanges,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
} from 'wlc-engine/modules/core';
import {WheelService} from 'wlc-engine/modules/wheel/system/services';

import * as Params from './participant-item.params';

@Component({
    selector: '[wlc-participant-item]',
    templateUrl: './participant-item.component.html',
    styleUrls: ['./styles/participant-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantItemComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input() public inlineParams: Params.IParticipantItemCParams;

    public override $params: Params.IParticipantItemCParams;
    public itsYou: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.IParticipantItemCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected wheelService: WheelService,
    ) {
        super(
            <IMixedParams<Params.IParticipantItemCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        if (this.$params.participant.id === this.wheelService.getUserWheel().idUser) {
            this.itsYou = true;
            this.$params.participant.name = gettext('You');
            this.prepareModifiers();
        }
    }

    protected prepareModifiers(): void {
        this.addModifiers('its-you');
    }
}
