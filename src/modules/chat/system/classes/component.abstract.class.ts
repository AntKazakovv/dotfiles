import {
    Component,
    HostBinding,
    Inject,
    OnDestroy,
    Self,
} from '@angular/core';
import {Subject} from 'rxjs';

@Component({template: ''})
export class AbstractChatComponent implements OnDestroy {
    @HostBinding('class') protected $classList!: Record<string, boolean>;
    public $class!: string;

    protected destroy$: Subject<void> = new Subject();

    constructor(
        @Self() @Inject('hostClass') hostClass: string,
    ) {
        this.$class = hostClass;
        this.$classList = {
            [this.$class]: true,
        };
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    protected addMod(mod: string): void {
        this.$classList = {
            ...this.$classList,
            [this.$class + '--' + mod]: true,
        };
    }

    protected switchMod(mod: string, to: boolean): void {
        this.$classList = {
            ...this.$classList,
            [this.$class + '--' + mod]: to,
        };
    }

    protected replaceMod(oldMod: string, newMod: string): void {
        this.removeMod(oldMod);
        this.addMod(newMod);
    }

    protected removeMod(mod: string): void {
        delete this.$classList[this.$class + '--' + mod];
        this.$classList = {...this.$classList};
    }
}
