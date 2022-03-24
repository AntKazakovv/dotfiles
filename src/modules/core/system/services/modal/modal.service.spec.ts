import {TestBed} from '@angular/core/testing';
import {
    BsModalService,
    ModalModule,
} from 'ngx-bootstrap/modal';

import {DEFAULT_MODAL_CONFIG} from 'wlc-engine/modules/core/components/modal/modal.params';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {IModalConfig} from 'wlc-engine/modules/core/components/modal/modal.interface';
import {WINDOW_PROVIDER} from 'wlc-engine/modules/app/system';

import _assignIn from 'lodash-es/assignIn';

describe('ModalService', () => {
    let modalService: ModalService;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;
    let eventServiceSpy: jasmine.SpyObj<EventService>;
    let logServiceSpy: jasmine.SpyObj<LogService>;
    let injectionServiceSpy: jasmine.SpyObj<InjectionService>;

    const existingModalId = 'test_modal';
    const nonExistingModalId = 'no_existing_modal';

    beforeEach(() => {
        configServiceSpy = jasmine.createSpyObj(
            'ConfigService',
            ['get'],
            {
                ready: Promise.resolve(),
            },
        );
        eventServiceSpy = jasmine.createSpyObj(
            'EventService',
            ['emit', 'subscribe'],
        );
        logServiceSpy = jasmine.createSpyObj(
            'LogService',
            ['sendLog'],
        );
        injectionServiceSpy = jasmine.createSpyObj(
            'InjectionService',
            ['loadComponent'],
        );

        TestBed.configureTestingModule({
            imports:[
                ModalModule.forRoot(),
            ],
            providers: [
                WINDOW_PROVIDER,
                ModalService,
                BsModalService,
                {
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
                {
                    provide: EventService,
                    useValue: eventServiceSpy,
                },
                {
                    provide: LogService,
                    useValue: logServiceSpy,
                },
                {
                    provide: InjectionService,
                    useValue: injectionServiceSpy,
                },
            ],
        });
        modalService = TestBed.inject(ModalService);

        configServiceSpy.get.withArgs('$modals.customModals').and.returnValue({});
        configServiceSpy.get.withArgs('$modals.restrictModal').and.returnValue({});
    });

    it('-> should be created', () => {
        expect(modalService).toBeDefined();
    });

    it('-> getActiveModal should return modal by passed id', async () => {
        await modalService.showModal(_assignIn({id: existingModalId}, DEFAULT_MODAL_CONFIG));
        const index = modalService['activeModals'].findIndex(item => item.id === existingModalId);

        expect(modalService.getActiveModal(existingModalId)).toEqual(modalService['activeModals'][index]);
    });

    it('-> showModal with restricted modals should call notificationError', async () => {
        const restrictedModal = modalService['restrictModal']['signup'];
        modalService['notificationError'] = jasmine.createSpy();

        configServiceSpy.get.withArgs(restrictedModal.baseConfigKey).and.returnValue(restrictedModal.baseConfigValue);
        await modalService.showModal('signup');

        expect(modalService['notificationError']).toHaveBeenCalledWith(
            restrictedModal.message,
            restrictedModal.wlcElement,
        );
    });

    it('-> showModal with modal id from modalList should call openModal', async () => {
        modalService['openModal'] = jasmine.createSpy();
        await modalService.showModal('login');

        expect(modalService['openModal']).toHaveBeenCalledWith(_assignIn(
            {},
            DEFAULT_MODAL_CONFIG,
            modalService['modalList']['login'].config,
        ));
    });

    it('-> showModal should call sendLog with non existing modal', () => {
        modalService.showModal(nonExistingModalId);

        expect(logServiceSpy.sendLog).toHaveBeenCalledWith({
            code: '0.3.2',
            data: {id: nonExistingModalId},
            flog: {id: nonExistingModalId},
        });
    });

    it('-> showModal should call sendLog without passed id and call loadComponent if pass componentName', async () => {
        const config: IModalConfig = _assignIn({id: null}, DEFAULT_MODAL_CONFIG);
        await modalService.showModal(config);
        expect(logServiceSpy.sendLog).toHaveBeenCalledWith({
            code: '0.3.1',
            data: {config},
        });

        const config2: IModalConfig = _assignIn(
            {id: nonExistingModalId, componentName: 'Test_component_name'},
            DEFAULT_MODAL_CONFIG,
        );
        await modalService.showModal(config2);
        expect(injectionServiceSpy.loadComponent).toHaveBeenCalledWith(config2.componentName);
    });

    it('-> showModal should call closeAllModals with dismissAll option', async () => {
        await modalService.showModal(_assignIn({id: existingModalId}, DEFAULT_MODAL_CONFIG));
        const modalServiceCloseAllModalsSpy = spyOn(modalService, 'closeAllModals');
        modalService.showModal({id: nonExistingModalId, dismissAll: true});

        expect(modalServiceCloseAllModalsSpy).toHaveBeenCalled();
    });

    it('-> showModal with opened modal should do nothing', async () => {
        await modalService.showModal(_assignIn({id: existingModalId}, DEFAULT_MODAL_CONFIG));
        const lengthBeforeOpen = modalService['activeModals'].length;
        modalService.showModal({id: existingModalId});

        expect(modalService['activeModals'].length).toBe(lengthBeforeOpen);
    });

    it('-> showModal should add modal in activeModals', () => {
        modalService.showModal({id: existingModalId});
        const indexNewModal = modalService['activeModals'].findIndex(item => item.id === existingModalId);

        expect(modalService['activeModals'][indexNewModal]).toBeDefined();
    });

    it('-> showError should call showModal method with assigning configs', () => {
        const modalServiceShowModalSpy = spyOn(modalService, 'showModal');
        const settingsForModal: Partial<IModalConfig> = {useBackButton: true};
        modalService.showError(settingsForModal);

        expect(modalServiceShowModalSpy).toHaveBeenCalledWith(_assignIn({
            id: 'Error',
            modalTitle: 'Error',
            textAlign: 'center',
            size: 'md',
        }, settingsForModal));
    });

    it('-> closeAllModals should call hideModal on every activeModal', async () => {
        const modalServiceHideModalSpy = spyOn(modalService, 'hideModal');
        modalService.closeAllModals();
        expect(modalServiceHideModalSpy).toHaveBeenCalledTimes(0);

        await modalService.showModal(_assignIn({id: existingModalId}, DEFAULT_MODAL_CONFIG));
        modalService.closeAllModals();

        modalService['activeModals'].forEach(({id}) => {
            expect(modalServiceHideModalSpy).toHaveBeenCalledWith(id, jasmine.any(String));
        });
    });

    it('-> hideModal should call sendLog with non existing modal id', () => {
        modalService.hideModal(nonExistingModalId);

        expect(logServiceSpy.sendLog).toHaveBeenCalledWith({
            code: '0.3.3',
            data: {id: nonExistingModalId},
            flog: {id: nonExistingModalId, method: 'hide'},
        });
    });

    it('-> closeModal should call sendLog if no modal exist or close this modal and remove from actives', async () => {
        await modalService.showModal(_assignIn({id: existingModalId}, DEFAULT_MODAL_CONFIG));

        const activeModalsLengthBefore = modalService['activeModals'].length;
        modalService['closeModal'](existingModalId);
        expect(modalService['activeModals'].length).toBe(activeModalsLengthBefore - 1);
        expect(modalService['closeQueue'].find((id) => id === existingModalId)).toBeUndefined();

        modalService['closeModal'](nonExistingModalId);
        expect(logServiceSpy.sendLog).toHaveBeenCalledWith({
            code: '0.3.3',
            data: {id: nonExistingModalId},
            flog: {id: nonExistingModalId, method: 'close'},
        });
    });
});
