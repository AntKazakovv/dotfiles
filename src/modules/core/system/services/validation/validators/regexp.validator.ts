import {FormControl} from '@angular/forms';

export function regexp(regexp: string) {
    return (control: FormControl) => {
        return new RegExp(regexp).test(control.value) ? {
            'regexp': true,
        } : null;
    };
}
