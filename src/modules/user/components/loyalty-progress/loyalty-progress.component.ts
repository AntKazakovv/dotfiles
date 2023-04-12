import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import {Observable} from 'rxjs';
import {
    map,
    skipWhile,
    startWith,
} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';

import * as Params from './loyalty-progress.params';

interface ILevelViewData {
    levelName?: string;
    userPoints?: number;
    nextLevelPoints?: number;
    percentProgress?: number;
}
@Component({
    selector: '[wlc-loyalty-progress]',
    templateUrl: './loyalty-progress.component.html',
    styleUrls: ['./styles/loyalty-progress.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyProgressComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILoyaltyProgressCParams;

    public override $params: Params.ILoyaltyProgressCParams;
    public levelData$: Observable<ILevelViewData> = this.UserService.userInfo$.pipe(
        skipWhile(v => !v),
        map(this.infoToViewData.bind(this)),
    ).pipe(startWith({}));

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyProgressCParams,
        configService: ConfigService,
        protected UserService: UserService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    protected infoToViewData(userInfo: UserInfo): ILevelViewData {
        return userInfo ? {
            levelName: userInfo.levelName,
            userPoints: userInfo.points,
            nextLevelPoints: userInfo.nextLevelPoints,
            percentProgress: !userInfo.nextLevelPoints ? 100
                : userInfo.points / userInfo.nextLevelPoints * 100,
        }: {};
    }
}
