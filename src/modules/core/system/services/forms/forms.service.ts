import {
    Injectable,
} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

@Injectable({
    providedIn: 'root',
})
export class FormsService {
    private formErrors: IIndexing<ValidationErrors> = {};

    public setControlErrors(controlName: string, errors: ValidationErrors): void {
        this.formErrors[controlName] = errors;
    }

    public getControlError(controlName: string): ValidationErrors {
        return this.formErrors[controlName];
    }

    public clearControlErrors(controlName: string): void {
        delete this.formErrors[controlName];
    }

    public clearAllControlErrors(): void {
        this.formErrors = {};
    }

}
