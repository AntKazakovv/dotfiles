import {HostBinding, Inject} from '@angular/core';
import {IComponentParams} from 'wlc-engine/interfaces/config.interface';

export class AbstractComponent {
    @HostBinding('class') public $class = '';

    constructor(
        protected params: IComponentParams
    ) {
        this.$class = params?.class;
    }
}
