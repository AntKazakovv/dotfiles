import {Pipe, PipeTransform} from '@angular/core';
import _get from 'lodash-es/get';
//  -- CONFIGS IMPORTS STARTS--;
import * as $config from 'wlc-config/index';

export type IDynamicPipe = (value: unknown, ...args: unknown[]) => unknown;

const $dynamicPipes = _get($config, '$dynamicPipes', {});

@Pipe({
    name: 'dynamicPipe',
})
export class DynamicPipe implements PipeTransform {
    transform(value: unknown, pipeName: string, params: unknown[] = []): any {
        // @ts-ignore no-implicit-any #672571
        if ($dynamicPipes.hasOwnProperty(pipeName) && typeof $dynamicPipes[pipeName] === 'function') {
            // @ts-ignore no-implicit-any #672571
            return $dynamicPipes[pipeName](value, ...params);
        } else {
            console.warn(`DynamicPipe: Pipe '${pipeName}' not found or is not a function.`);
            return value;
        }
    }
}
