import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

import {CoreModule} from 'wlc-engine/modules/core/core.module';

import {WidgetWheelComponent} from './components/widget-wheel/widget-wheel.component';
import {CreateWheelComponent} from './components/create-wheel/create-wheel.component';
import {WheelService} from 'wlc-engine/modules/wheel/system/services';
import {GatheringParticipantsComponent} from './components/gathering-participants/gathering-participants.component';
import {ParticipantItemComponent} from './components/participant-item/participant-item.component';
import {CancelRaffleComponent} from './components/cancel-raffle/cancel-raffle.component';
import {WaitingResultsComponent} from './components/waiting-results/waiting-results.component';
import {SelectionWinnerComponent} from './components/selection-winner/selection-winner.component';
import {ResultWheelComponent} from './components/result-wheel/result-wheel.component';

export const services = {
    'wheel-service': WheelService,
};

export const components = {
    'wlc-widget-wheel': WidgetWheelComponent,
    'wlc-create-wheel': CreateWheelComponent,
    'wlc-gathering-participatns': GatheringParticipantsComponent,
    'wlc-participant-item': ParticipantItemComponent,
    'wlc-cancel-raffle': CancelRaffleComponent,
    'wlc-waiting-results': WaitingResultsComponent,
    'wlc-selection-winner': SelectionWinnerComponent,
};

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        TranslateModule,
        CoreModule,
    ],
    declarations: [
        WidgetWheelComponent,
        CreateWheelComponent,
        GatheringParticipantsComponent,
        ParticipantItemComponent,
        CancelRaffleComponent,
        WaitingResultsComponent,
        SelectionWinnerComponent,
        ResultWheelComponent,
    ],
    providers: [
        WheelService,
    ],
    exports: [
        WidgetWheelComponent,
        CreateWheelComponent,
        GatheringParticipantsComponent,
        ParticipantItemComponent,
        CancelRaffleComponent,
        WaitingResultsComponent,
        SelectionWinnerComponent,
        ResultWheelComponent,
    ],
})
export class WheelModule {
}
