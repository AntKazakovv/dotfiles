import {UntypedFormControl} from '@angular/forms';

import {ISelectCParams} from 'wlc-engine/modules/core';

export const defaultParams: ISelectCParams = {
    class: 'wlc-select',
    moduleName: 'pep',
    labelText: gettext('PEP'),
    control: new UntypedFormControl(''),
    common: {
        placeholder: gettext('PEP'),
        tooltipText: gettext('Politically Exposed Person'),
    },
    updateOnControlChange: true,
    locked: true,
    name: 'pep',
    validators: [],
    options: 'pep',
};
