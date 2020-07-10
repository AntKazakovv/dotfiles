import {
    Component,
    OnInit,
    HostBinding,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';

@Component({
    selector: '[wlc-logo]',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent implements OnInit {
    @HostBinding('class') hostClass = 'wlc-logo';

    constructor(
        private cdr: ChangeDetectorRef,
    ) {
    }

    ngOnInit(): void {
    }
}
