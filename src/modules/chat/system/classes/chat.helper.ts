

export class ChatHelper {

    /**
     * Creates random id
     */
    public static id(): string {
        let i: string;
        while (!i) {
            i = Math.random()
                .toString(36)
                .substring(2, 14);
        }
        return i;
    }

    /**
     * Turn string to color
     * @param str string to be turned
     * @returns hex color
     */
    public static stringToColor(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '';
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).slice(-2);
        }
        return color;
    };

    /**
     * Define if color light or dark and returns opposite white or black
     * @param hex hex color without `#`
     * @returns white or black string hex
     */
    public static invertColor(hex: string): string {
        let r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '000000'
            : 'FFFFFF';
    };

    public static emojiRegex: RegExp = /\p{Emoji_Presentation}/ug;

    public static nicknameForbiddenSymbols: RegExp = /[\t\n\r!"&',./:<>?@]/;

    public static async wait(time: number): Promise<void> {

        await new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    };

}
