import {
    TestBed,
} from '@angular/core/testing';

import {
    HooksService,
    HookHandler,
    IHookHandlerDescriptor,
} from './hooks.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';

import _isArray from 'lodash-es/isArray';
import _bind from 'lodash-es/bind';

interface IHookData {
    content: string;
}

interface IHookContext {
    prefix: string;
}

describe('HooksService', () => {
    let hooksService: HooksService;

    const hooks: IIndexing<HookHandler<IHookData>> = {
        'first': function (this: IHookContext, data: IHookData): IHookData {
            const context: IHookContext = this;
            data.content = `${context.prefix}_${data.content}_end`;
            return data;
        },
        'second': function (this: IHookContext, data: IHookData): IHookData {
            const context: IHookContext = this;
            data.content = `${context.prefix}_${data.content}`;
            return data;
        },
    };

    const hookTestContext: IHookContext = {
        prefix: 'start',
    };

    const checkHookHandlerFormat = (handler: IHookHandlerDescriptor): void => {
        expect(handler).toEqual({
            handlerIndex: handler.handlerIndex,
            name: handler.name,
        });
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [HooksService],
        });

        hooksService = TestBed.inject(HooksService);
    });

    it('-> should be created', () => {
        expect(hooksService).toBeTruthy();
    });

    it('-> should set hooks', () => {
        const hookHandler1: IHookHandlerDescriptor = hooksService.set('test', hooks['first'], hookTestContext);

        expect(_isArray(hooksService['hooks'].test)).toBeTrue();
        expect(hooksService['hooks'].test.length).toBe(1);
        checkHookHandlerFormat(hookHandler1);

        const hookHandler2: IHookHandlerDescriptor = hooksService.set('test', hooks['first'], hookTestContext);

        expect(hooksService['hooks'].test.length).toBe(2);
        checkHookHandlerFormat(hookHandler2);

        for (const item of hooksService['hooks'].test) {
            expect(typeof item).toBe('function');
        }
    });

    it('-> should run hooks', async () => {
        expect(await hooksService.run<IHookData>('test', {content: 'text'})).toEqual({
            content: 'text',
        });

        hooksService.set('test', hooks['first'], hookTestContext);

        expect(await hooksService.run<IHookData>('test', {content: 'text'})).toEqual({
            content: 'start_text_end',
        });
    });

    it('-> should clear hooks', () => {
        hooksService.clear([{
            handlerIndex: 0,
            name: 'test',
        }]);

        expect(hooksService['hooks'].test).toBeUndefined();

        const hookHandler1: IHookHandlerDescriptor = hooksService.set('test', hooks['first'], hookTestContext);
        const hookHandler2: IHookHandlerDescriptor = hooksService.set('test', hooks['second'], hookTestContext);

        expect(hooksService['hooks'].test.length).toBe(2);

        hooksService.clear([hookHandler2]);

        expect(hooksService['hooks'].test.length).toBe(1);
        expect(hooksService['hooks'].test[0]({
            content: 'text',
        })).toEqual(_bind(hooks['first'], hookTestContext)({
            content: 'text',
        }));

        hooksService.clear([hookHandler1]);

        expect(hooksService['hooks'].test.length).toBe(0);
    });
});
