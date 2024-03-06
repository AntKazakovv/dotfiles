import {
    Injectable,
    inject,
    OnDestroy,
} from '@angular/core';
import {
    Transition,
    UIRouter,
} from '@uirouter/core';

import {
    Subject,
    BehaviorSubject,
} from 'rxjs';
import _includes from 'lodash-es/includes';

import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {
    hidePwaNotification,
    hidePwaNotificationStorage,
} from 'wlc-engine/modules/pwa/constants';

export interface IControllerParams {
    excludeStates: string[];
}

@Injectable()
export class PwaNotificationController implements OnDestroy {

    public readonly visible$ = new BehaviorSubject<boolean>(false);

    protected props: IControllerParams;
    protected readonly instructionState = 'app.instructions';
    protected readonly instructionSlug = 'install-pwa';
    protected readonly destroy$: Subject<void> = new Subject();

    protected readonly eventService = inject(EventService);
    protected readonly configService = inject(ConfigService);
    protected readonly router =  inject(UIRouter);

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public get enabled(): boolean {
        return !this.configService.get({
            name: hidePwaNotification,
            storageType: hidePwaNotificationStorage,
        });
    }

    public async init(props: IControllerParams): Promise<void> {
        this.props = props;
        await this.configService.ready;
        this.changeVisibility(this.enabled
            && !this.isExcludeStates(this.router.globals.current.name));
        this.excludeStatesHandler();
    }

    public openInstruction(): void {
        this.router.stateService.go(this.instructionState, {slug: this.instructionSlug});
        this.close();
    }

    public close(): void {
        this.configService.set({
            name: hidePwaNotification,
            value: true,
            storageType: hidePwaNotificationStorage,
        });
        this.changeVisibility(false);
    }

    protected changeVisibility(show: boolean): void {
        this.visible$.next(show);
    }

    protected isExcludeStates(stateName: string): boolean {
        return _includes(this.props?.excludeStates, stateName);
    }

    protected excludeStatesHandler(): void {
        this.eventService.subscribe({name: 'TRANSITION_SUCCESS'}, (transition: Transition): void => {
            const stateName: string = transition.targetState().name();
            if (stateName === this.instructionState && transition.params().slug === this.instructionSlug) {
                this.close();
            } else if (this.enabled) {
                this.changeVisibility(!this.isExcludeStates(stateName));
            }
        }, this.destroy$);
    }
}
