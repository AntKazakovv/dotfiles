import {Game} from './game.model';

describe('Game', () => {
    it('should create an instance', () => {
        const data: Game = {
            "ID": "319200",
            "Image": "/gstatic/games/evosw/232/monopoly.jpg",
            "Url": "998/monopoly:Monopoly00000001",
            "Name": {
                "en": "Monopoly LIVE",
                "ru": "Монополия LIVE"
            },
            "Description": [],
            "MobileUrl": "998/monopoly:Monopoly00000001:nez3yaoobwxaepvq",
            "Branded": 0,
            "hasDemo": 0,
            "CategoryID": [
                "37",
                "33"
            ],
            "MerchantID": "998",
            "AR": "16:9",
            "IDCountryRestriction": "23",
            "Sort": "319200",
            "LaunchCode": "monopoly--Monopoly00000001",
            "isRestricted": false
        };
        expect(new Game(data)).toBeTruthy();
    });
});
