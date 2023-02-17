export const dummyAvatar: string = 'data:image/png;base64,'
    + 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQ'
    + 'VR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==';


export const mucNs = 'http://jabber.org/protocol/muc';
export const mucUserNs = `${mucNs}#user`;
export const mucAdminNs = `${mucNs}#admin`;
export const mucOwnerNs = `${mucNs}#owner`;
export const mucRoomConfigFormNs = `${mucNs}#roomconfig`;
export const mucRequestFormNs = `${mucNs}#request`;

export const tempUser = {
    username: 'anonymous',
    password: 'anonymous',
} as const;
