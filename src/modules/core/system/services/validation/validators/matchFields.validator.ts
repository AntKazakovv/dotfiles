import {UntypedFormGroup} from '@angular/forms';

export function matchingFieldsValidator(controlsName: [string, string]) {
    return (formGroup: UntypedFormGroup) => {
        const [firstField, secondField] = controlsName;
        const control = formGroup.controls[firstField];
        const matchingControl = formGroup.controls[secondField];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({'mustMatch': true});
        } else {
            matchingControl.setErrors(null);
        }
    };
}
