import {Component, ChangeDetectorRef} from '@angular/core';

@Component({
    selector: 'wlc-demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss']
})
export class demoTestComponent {

    public isLoading: boolean = false;
    public isLoading2: boolean = false;

    constructor(protected changeDetector: ChangeDetectorRef) {}

    load(): void {
        this.isLoading = true;

        setTimeout(() => {
            this.isLoading = false;
            this.changeDetector.detectChanges();
        }, 3000)
    }

    load2(): void {
        this.isLoading2 = true;

        setTimeout(() => {
            this.isLoading2 = false;
            this.changeDetector.detectChanges();
        }, 3000)
    }

}
