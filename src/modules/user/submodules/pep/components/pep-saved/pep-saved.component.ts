import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {
    PepPhrases,
    phrases,
} from 'wlc-engine/modules/user/submodules/pep/system/services/pep/pep.translations';

import * as Params from './pep-saved.params';

@Component({
    selector: '[wlc-pep-saved]',
    templateUrl: './pep-saved.component.html',
    styleUrls: ['./styles/pep-saved.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PepSavedComponent extends AbstractComponent {
    @Input() public inlineParams: Params.IPepSavedCParams;

    public override $params: Params.IPepSavedCParams;
    public readonly phrases: PepPhrases = phrases;

    constructor(@Inject('injectParams') protected injectParams: Params.IPepSavedCParams) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public get isMarkedAsPep(): boolean {
        return this.$params.pep;
    }
}
