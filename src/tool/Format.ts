export interface DateFormatOptions {
    date?: boolean | { separator?: string };
    time?: boolean | { separator?: string; seconds?: boolean | {}; };
    separator?: string;
}

interface _DateFormatOptions {
    date?: { separator: string; };
    time?: { separator: string; seconds?: {}; };
    separator: string;
}

interface TimeSpan {
    ticks: number
    days: number
    hours: number
    milliseconds: number
    minutes: number
    seconds: number
    totalDays: number
    totalHours: number
    totalMilliseconds: number
    totalMinutes: number
    totalSeconds: number
}

export interface TimeFormatOptions {
    days?: boolean | { unit?: string };
    time?: boolean | {
        separator?: string;
        hours?: boolean | { unit?: string };
        minutes?: boolean | { unit?: string };
        seconds?: boolean | { unit?: string };
    };
    separator?: string;
    format?: ((time: TimeSpan) => string) | null;
}

interface _TimeFormatOptions {
    days: { unit: string };
    time: {
        separator: string;
        hours: { unit: string };
        minutes: { unit: string };
        seconds: { unit: string };
    };
    separator: string;
    format: ((time: TimeSpan) => string) | null;
}

type Options = Record<string, any>;

const mergeOptions = (target?: Options, src?: Options) => {
    if (!target || !src) {
        return;
    }
    for (const key in target) {
        if (target[key] == null || target[key] == undefined) {
            target[key] = src[key];
        }else if (typeof target[key] == "object") {
            if (typeof src[key] == "object") {
                mergeOptions(target[key], src[key]);
            } else if (src[key] == false) {
                target[key] = src[key];
            }
        } else if (typeof target[key] == typeof src[key]) {
            target[key] = src[key];
        }
    }
}

export default class Format {

    static date(str: string | Date | null, options?: DateFormatOptions): string {
        if (!str) {
            return "";
        }
        if (str === "0001-01-01T00:00:00") {
            return "";
        }
        let _options: _DateFormatOptions = {
            date: {
                separator: "-",
            },
            time: {
                separator: ":",
                seconds: {},
            },
            separator: " ",
        };
        mergeOptions(_options, options);

        let format: string[] = [];
        if (_options.date) {
            let date = ["yyyy", "MM", "dd"];
            format.push(date.join(_options.date.separator));
        }
        if (_options.time) {
            let time = ["HH", "mm"];
            if (_options.time.seconds) {
                time.push("ss");
            }
            format.push(time.join(_options.time.separator));
        }
        return new Date(str).format(format.join(_options.separator));
    };

    static time(str: string | TimeSpan | null, options?: TimeFormatOptions): string {
        if (!str) {
            return "";
        }
        let timeSpan = str as TimeSpan;
        if (typeof str === "string") {
            let s = str.substring(0, str.length - 8);
            // return str.indexOf(".") != -1 ? (str.split(".")[0] + "天") : str;
            let daysStr = "";
            let timesStr = "";
            if (s.indexOf(".") != -1) {
                let s1 = s.split(".");
                daysStr = s1[0];
                timesStr = s1[1];
            } else {
                daysStr = "0";
                timesStr = s;
            }
            let timesArray = timesStr.split(":");
            let days = Number.parseInt(daysStr);
            let hours = Number.parseInt(timesArray[0]);
            let minutes = Number.parseInt(timesArray[1]);
            let seconds = Number.parseInt(timesArray[2]);
            timeSpan = {
                days, hours, minutes, seconds, milliseconds: 0,
                ticks: 0, totalDays: 0, totalHours: 0, totalMilliseconds: 0, totalMinutes: 0, totalSeconds: 0
            };
        }
        let _options: _TimeFormatOptions = {
            days: { unit: "" },
            time: {
                separator: ":",
                hours: { unit: "" },
                minutes: { unit: "" },
                seconds: { unit: "" },
            },
            separator: ".",
            format: null,
        };
        mergeOptions(_options, options);
        if (_options.format) {
            return _options.format(timeSpan);
        }
        let format: string[] = [];
        if (_options.days) {
            format.push(timeSpan.days + _options.days.unit);
        }
        if (_options.time) {
            let time: string[] = [];
            if (_options.time.hours) {
                time.push(timeSpan.hours + _options.time.hours.unit);
            }
            if (_options.time.minutes) {
                time.push(timeSpan.minutes + _options.time.minutes.unit);
            }
            if (_options.time.minutes) {
                time.push(timeSpan.minutes + _options.time.minutes.unit);
            }
            format.push(time.join(_options.time.separator));
        }
        return format.join(_options.separator);
    }

}