import {IMocksConfig} from 'wlc-engine/modules/core/system/interfaces/base-config/mocks.interface';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';

import bonusesMocks from 'wlc-engine/system/mocks/bonuses.json';
import tournamentsMocks from 'wlc-engine/system/mocks/tournaments.json';
import biggestWins from 'wlc-engine/system/mocks/biggestWins.json';
import latestWinsMocks from 'wlc-engine/system/mocks/latestWins.json';
import jackpotsMocks from 'wlc-engine/system/mocks/jackpots.json';

type TMockData = Pick<IData, 'code' | 'data'> & {status: string};

export const MOCKS_DATA: {[key in keyof IMocksConfig['base']]: TMockData} = {
    jackpots: jackpotsMocks,
    bonuses: bonusesMocks,
    tournaments: tournamentsMocks,
    topWins: biggestWins,
    wins: latestWinsMocks,
};
