import {FormControl} from '@angular/forms';

export function regexp(regexp: string) {
    return (control: FormControl) => {
        return new RegExp(regexp).test(control.value) ? {'regexp': true} : null;
    };
}

export function regexpEmoji() {
    return (control: FormControl) => {
        return (control.value).match(new RegExp(/\p{Emoji_Presentation}/gu)) ? {'regexpEmoji': true} : null;
    };
}
