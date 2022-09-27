type Phrases<Keys extends string> = Record<Keys, string>;

type NotificationPhrases = Phrases<'title' | 'message'>;

type InfoModalPhraseKey = 'title'
    | 'explaining'
    | 'pleaseNote'
    | 'notice'
    | 'confirm'
    | 'close'
    | 'next'
    | 'term';

type InfoModalPhrases = Phrases<InfoModalPhraseKey>;

type ConfirmationModalPhraseKey = 'title'
    | 'message'
    | 'back'
    | 'confirm'
    | 'password';

type ConfirmationModalPhrases = Phrases<ConfirmationModalPhraseKey>;

type SavedModalPhraseKey = 'title'
    | 'close'
    | 'success'
    | 'markedAsPep'
    | 'markedAsNotPep';

type SavedModalPhrases = Phrases<SavedModalPhraseKey>

type ErrorPhrases = Record<'incorrectPassword' | 'changeStatus', NotificationPhrases>;

type ModalsPhrases = {
    confirmation: ConfirmationModalPhrases;
    info: InfoModalPhrases;
    saved: SavedModalPhrases;
};

type StatusPhrases = Record<'cancel', NotificationPhrases>;

export type PepPhrases = {
    modals: ModalsPhrases;
    status: StatusPhrases;
    error: ErrorPhrases;
};

const statusCancel: NotificationPhrases = {
    title: gettext('Confirmation canceled'),
    message: gettext('PEP status isn\'t approved'),
};

const incorrectPassword: NotificationPhrases = {
    title: gettext('Incorrect password'),
    message: gettext('You have submitted incorrect password. Please try again'),
};

const changeStatus: NotificationPhrases = {
    title: gettext('Error'),
    message: gettext('An error has occurred during the setting your PEP status'),
};

const infoModal: InfoModalPhrases = {
    title: gettext('Politically Exposed Person'),
    explaining: gettext(
        'means an individual who is or ' +
        'has been entrusted with prominent public functions, as but not limited ' +
        'to Heads of State / Government, Ministers, Parliamentary Secretaries, ' +
        'Members of Court, Ambassadors, Members of the administrative, ' +
        'management or supervisory boards pf State-owned enterprises. ' +
        'Relatives of Close Associates of a PEP should also tick this box.',
    ),
    pleaseNote: gettext('Please note'),
    notice: gettext(
        'that in terms of our regulatory ' +
        'we shall require additional information and documents to verify the ' +
        'identity and, in particular, to confirm the source of funds of individuals ' +
        'with the PEP status. For this purpose You will be asked to complete our ' +
        'KYC forms and provide us with sufficient supporting documents to ' +
        'confirm Your source of funds.',
    ),
    confirm: gettext('I confirm that I have read and understood all of the above information'),
    close: gettext('Close'),
    next: gettext('Next'),
    term: gettext('PEP'),
};

const confirmationModal: ConfirmationModalPhrases = {
    title: gettext('Confirmation'),
    password: gettext('Password'),
    confirm: gettext('Confirm'),
    message: gettext('Please enter your password to confirm the action'),
    back: gettext('Back'),
};

const savedModal: SavedModalPhrases = {
    title: gettext('Politically Exposed Person'),
    close: gettext('Close'),
    success: gettext('Changes saved successfully'),
    markedAsPep: gettext('Now you\'re marked as PEP'),
    markedAsNotPep: gettext('Now you aren\'t marked as PEP'),
};

export const phrases: PepPhrases = {
    status: {
        cancel: statusCancel,
    },
    modals: {
        confirmation: confirmationModal,
        info: infoModal,
        saved: savedModal,
    },
    error: {
        incorrectPassword,
        changeStatus,
    },
};
