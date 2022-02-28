import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import {ITextBlockCParams} from 'wlc-engine/modules/core/components/text-block/text-block.params';
import {IInputCParams} from 'wlc-engine/modules/core/components/input/input.params';
import {IButtonCParams} from 'wlc-engine/modules/core/components/button/button.params';

export namespace wlcSignInPageForm {
    export const kiosk: ILayoutComponent = {
        name: 'user.wlc-sign-in-form',
        params: {
            formConfig: {
                class: 'wlc-form-wrapper',
                components: [
                    {
                        name: 'core.wlc-text-block',
                        params: <ITextBlockCParams>{
                            common: {
                                textBlockTitle: gettext('Sign in'),
                                textBlockSubtitle: gettext('Welcome back!'),
                            },
                        },
                    },
                    {
                        name: 'core.wlc-input',
                        params: <IInputCParams>{
                            theme: 'vertical',
                            wlcElement: 'block_email-login',
                            common: {
                                placeholder: gettext('E-mail'),
                                type: 'email',
                            },
                            name: 'email',
                            validators: ['required', 'email'],
                        },
                    },
                    {
                        name: 'core.wlc-input',
                        params: <IInputCParams>{
                            theme: 'vertical',
                            wlcElement: 'block_password',
                            common: {
                                placeholder: gettext('Password'),
                                type: 'password',
                                customModifiers: 'right-shift',
                                usePasswordVisibilityBtn: true,
                                fixAutoCompleteForm: false,
                            },
                            name: 'password',
                            validators: ['required'],
                        },
                    },
                    {
                        name: 'core.wlc-button',
                        params: <IButtonCParams>{
                            wlcElement: 'button_login-submit',
                            common: {
                                customModifiers: 'submit',
                                text: gettext('Login'),
                                typeAttr: 'submit',
                            },
                            themeMod: 'secondary',
                        },
                    },
                ],
            },
        },
    };
}
