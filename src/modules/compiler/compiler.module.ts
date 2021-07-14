import {NgModule} from '@angular/core';
import {Compiler, COMPILER_OPTIONS, CompilerFactory} from '@angular/core';
import {JitCompilerFactory} from '@angular/platform-browser-dynamic';
import {DynamicHtmlComponent} from 'wlc-engine/modules/compiler/components/dynamic-html/dynamic-html.component';

export function createCompiler(compilerFactory: CompilerFactory) {
    return compilerFactory.createCompiler();
}

export const components = {
    'wlc-dynamic-html': DynamicHtmlComponent,
};

@NgModule({
    declarations: [
        DynamicHtmlComponent,
    ],
    id: 'CompilerModule',
    providers: [
        {provide: COMPILER_OPTIONS, useValue: {}, multi: true},
        {provide: CompilerFactory, useClass: JitCompilerFactory, deps: [COMPILER_OPTIONS]},
        {provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory]},
    ],
    exports: [
        DynamicHtmlComponent,
    ],
})
export class CompilerModule {
}
