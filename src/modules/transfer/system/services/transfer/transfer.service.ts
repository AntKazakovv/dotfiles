import {Injectable} from '@angular/core';

import _isObject from 'lodash-es/isObject';

import {
    ConfigService,
    IData,
    DataService,
    LogService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {IBonus} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';
import {
    ITransferSendDataParams,
    ITransfer,
    ITransferResponse,
} from 'wlc-engine/modules/transfer/system/interfaces';
import {TransferModel} from 'wlc-engine/modules/transfer/system/models';
import {BonusesService} from 'wlc-engine/modules/bonuses';
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';

@Injectable({
    providedIn: 'root',
})
export class TransferService {
    protected walletsService: WalletsService;

    bonusesService: BonusesService;

    constructor(
        public injectionService: InjectionService,
        private dataService: DataService,
        private logService: LogService,
        private configService: ConfigService,
    ) {
        this.registerMethods();
        this.setMultiWallet();
        this.init();
    }

    /**
     * Get transfer params
     *
     * @return {Promise} response server response
     */
    public async getTransferData(): Promise<TransferModel> {
        try {
            const response: IData<ITransfer> = await this.dataService.request('transfer/get');
            return this.modifyTransfer(response.data);
        } catch(error) {
            this.logService.sendLog({code: '27.0.2', data: error});
            return Promise.reject(error);
        }
    }

    /**
     * Prepares transferModel from back-end data
     *
     * @returns {TransferModel} TransferModel object
     *
     */
    private modifyTransfer(data: ITransfer): TransferModel {
        if (!data) {
            return;
        }

        return new TransferModel(
            {service: 'TransferService', method: 'modifyTransfer'},
            data,
        );
    }

    /**
     * Get information about transfer bonus
     *
     * @return {Promise} response server response
     */
    public async getBonusInfo(): Promise<Bonus> {
        try {
            const response: IData<IBonus> = await this.dataService.request('transfer/bonusInfo');
            if (_isObject(response.data)) {
                return new Bonus(
                    {service: 'TransferService', method: 'getBonusInfo'},
                    response.data,
                    this.walletsService,
                    this.configService,
                    this.bonusesService.userCurrency$,
                );
            } else {
                this.logService.sendLog({code: '10.0.1', data: response.data});
            }
        } catch(error) {
            this.logService.sendLog({code: '27.0.2', data: error});
            return Promise.reject(error);
        }
    }

    /**
     * Get transfer code
     *
     * @param {ITransferSendDataParam} params transfer data
     *
     * @return {Promise} response server response
     */
    public async sendData(params: ITransferSendDataParams): Promise<ITransferResponse> {
        try {
            const response: IData<ITransferResponse> = await this.dataService.request('transfer/transfer', params);
            return response.data;
        } catch(error) {
            this.logService.sendLog({code: '27.0.0', data: error});
            return Promise.reject(error);
        }
    }

    /**
     * Send transfer code
     *
     * @param {number} code transfer code
     *
     * @return {Promise} response server response
     */
    public async sendCode(code: number): Promise<ITransferResponse> {
        const params = {code};
        try {
            const response: IData<ITransferResponse> = await this.dataService.request('transfer/validate', params);
            return response.data;
        } catch(error) {
            this.logService.sendLog({code: '27.0.1', data: error});
            return Promise.reject(error);
        }
    }

    private async setMultiWallet(): Promise<void> {
        if (this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet')) {
            this.walletsService = await this.injectionService.getService<WalletsService>('multi-wallet.wallet-service');
        }
    }

    private async init(): Promise<void> {
        this.bonusesService = await this.injectionService.getService<BonusesService>('bonuses.bonuses-service');
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'get',
            system: 'transfer',
            url: '/transfer',
            type: 'GET',
            events: {
                success: 'TRANSFER_GETTING_INFO_SUCCEEDED',
                fail: 'TRANSFER_GETTING_INFO_FAILED',
            },
        });
        this.dataService.registerMethod({
            name: 'transfer',
            system: 'transfer',
            url: '/transfer',
            type: 'POST',
            events: {
                success: 'TRANSFER_GETTING_CODE_SUCCEEDED',
                fail: 'TRANSFER_GETTING_CODE_FAILED',
            },
        });

        this.dataService.registerMethod({
            name: 'validate',
            system: 'transfer',
            url: '/transfer',
            type: 'PUT',
            events: {
                success: 'TRANSFER_VALIDATION_SUCCEEDED',
                fail: 'TRANSFER_VALIDATION_FAILED',
            },
        });

        this.dataService.registerMethod({
            name: 'bonusInfo',
            system: 'transfer',
            url: '/transfer/bonusInfo',
            type: 'GET',
            events: {
                success: 'TRANSFER_BONUS_INFO_SUCCEEDED',
                fail: 'TRANSFER_BONUS_INFO_FAILED',
            },
        });
    }
}
