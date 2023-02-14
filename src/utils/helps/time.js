import { isString } from "./functions";

class STimer {
    static now() {
        return Date.now();
    }

    static add(originTime, value = 0, unit = "s") {
        switch (unit) {
            case "s":
            case "seconds":
                return originTime + value * 1000;
            case "m":
            case "minutes":
                return originTime + value * 60000;
            case "h":
            case "hours":
                return originTime + value * 3600000;
            case "d":
            case "days":
                return originTime + value * 86400000;
            default:
                return originTime;
        }
    }

    static minus(originTime, value = 0, unit = "s") {
        switch (unit) {
            case "s":
            case "seconds":
                return originTime - value;
            case "m":
            case "minutes":
                return originTime - value * 60;
            case "h":
            case "hours":
                return originTime - value * 60 * 60;
            case "d":
            case "days":
                return originTime - value * 60 * 60 * 24;
            default:
                return originTime;
        }
    }

    static isBefore(originTime, desTime) {
        return originTime - desTime < 0;
    }

    static isAfter(originTime, desTime) {
        return originTime - desTime > 0;
    }

    static isEqual(originTime, desTime) {
        return originTime - desTime == 0;
    }
}

class Timer {
    constructor(time) {
        this.time = this.validateTime(time);
    }

    get() {
        return this.time;
    }

    getTime() {
        return this.time.getTime();
    }

    validateTime(time = new Date()) {
        if (isString(time)) return new Date(time);
        return time;
    }

    add(value, unit) {
        this.time.setTime(STimer.add(this.time.getTime(), value, unit));
        return this;
    }

    minus(value, unit) {
        this.time.setTime(STimer.minus(this.time.getTime(), value, unit));
        return this;
    }

    isBefore(time) {
        return STimer.isBefore(this.time.getTime(), this.validateTime(time).getTime());
    }

    isAfter(time) {
        return STimer.isAfter(this.time.getTime(), this.validateTime(time).getTime());
    }

    isEqual(time) {
        return STimer.isEqual(this.time.getTime(), this.validateTime(time).getTime());
    }

    valueOf() {
        return this.get();
    }

    toDateObject() {
        return {
            day: this.time.getDate(),
            month: this.time.getMonth() + 1,
            year: this.time.getFullYear(),
            hour: this.time.getHours(),
            minute: this.time.getMinutes(),
            second: this.time.getSeconds(),
        };
    }
}

export const time = (time) => new Timer(time);

export const format = (date = time().toDateObject(), form = "YYYY-MM-DD") => {
    let dateObject = date;
    if (date instanceof Date || isString(date)) dateObject = time(date).toDateObject();
    const { day = 1, month = 1, year = 2000, hour = 0, minute = 0, second = 0 } = dateObject;

    switch (form) {
        case "YYYY-MM-DD": {
            return year + "-" + ((month < 10 ? "0" : "") + month) + "-" + ((day < 10 ? "0" : "") + day);
        }
        case "DD/MM/YYYY H:M:S": {
            const time =
                (hour < 10 ? "0" + hour : hour) +
                ":" +
                (minute < 10 ? "0" + minute : minute) +
                ":" +
                (second < 10 ? "0" + second : second);
            return (day < 10 ? "0" : "") + day + "/" + ((month < 10 ? "0" : "") + month) + "/" + year + " " + time;
        }
        case "YYYY-MM-DD H:M:S": {
            const time =
                (hour < 10 ? "0" + hour : hour) +
                ":" +
                (minute < 10 ? "0" + minute : minute) +
                ":" +
                (second < 10 ? "0" + second : second);
            return year + "-" + ((month < 10 ? "0" : "") + month) + "-" + ((day < 10 ? "0" : "") + day) + " " + time;
        }
        case "H:M DD/MM": {
            const time = (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute);
            return time + " " + ((day < 10 ? "0" : "") + day) + "/" + ((month < 10 ? "0" : "") + month);
        }
        case "DD/MM/YYYY":
            return `${(day < 10 ? "0" : "") + day}/${(month < 10 ? "0" : "") + month}/${year}`;
        case "H:M:S": {
            const time =
                (hour < 10 ? "0" + hour : hour) +
                ":" +
                (minute < 10 ? "0" + minute : minute) +
                ":" +
                (second < 10 ? "0" + second : second);
            return time;
        }
        default:
            return undefined;
    }
};
