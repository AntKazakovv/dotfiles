import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';

export class DateHelper {
    public static readonly milliSecondsInSecond = 1000;
    public static readonly hoursInDay = 24;
    public static readonly minutesInHour = 60;
    public static readonly secondsInMinute = 60;
    public static get milliSecondsInDay(): number {
        return this.milliSecondsInHours * this.hoursInDay;
    }
    public static get milliSecondsInHours(): number {
        return this.milliSecondsInMinutes * this.minutesInHour;
    }
    public static get milliSecondsInMinutes(): number {
        return this.milliSecondsInSecond * this.secondsInMinute;
    }
    public static dayExists(date: Dayjs): boolean {
        return !!Math.floor((date.unix() - dayjs().unix())
            * this.milliSecondsInSecond / this.milliSecondsInDay);
    }
    public static hoursExists(date: Dayjs): boolean {
        return !!Math.floor((date.unix() - dayjs().unix())
            * this.milliSecondsInSecond / this.milliSecondsInHours % this.hoursInDay);
    }
}
