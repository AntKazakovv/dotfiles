import {
    Pipe,
    PipeTransform,
} from '@angular/core';

import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

@Pipe({name: 'proxyStaticUrl'})
export class ProxyStaticUrlPipe implements PipeTransform {
    transform(value: string): string {
        return GlobalHelper.proxyUrl(value);
    }
}
