import Vue from "vue";

export const uuid = () => {
    var s: any[] = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

export const loadData = (data0: any, data: any) => {
    // console.log(data0);
    // console.log(data);
    if (!data0 || !data) {
        return;
    }

    const keys = Object.keys(data0);
    keys.forEach(key => {
        if (data[key]) {
            data0[key] = data[key];
        }
    });
}

export const today = () => {
    let start = new Date();
    let end = new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59);
    return [start, end];
}

export const toNow = () => {
    let start = new Date();
    let end = new Date();
    start.setHours(0, 0, 0, 0);
    return [start, end];
}

export const yesterday = () => {
    let start = new Date();
    let end = new Date();
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59);
    return [start, end];
}

export const age = (birth?: string | Date | null | false) => {
    if (!birth) {
        return "";
    }
    let date = new Date(birth);
    let year = 1000 * 60 * 60 * 24 * 365;
    let now = new Date();
    let age = Math.floor((now.getTime() - date.getTime()) / year);
    return age;
}

export const duration = ({ startTime, endTime, semantic = false, days = true, hours = true, minutes = true, seconds = false, }: {
    startTime: Date | string | number | null | undefined,
    endTime: Date | string | number | null | undefined,
    semantic?: boolean,
    days?: boolean,
    hours?: boolean,
    minutes?: boolean,
    seconds?: boolean,
}) => {
    if (startTime != 0 && !startTime || endTime != 0 && !endTime) {
        return null;
    }
    if (startTime === "0001-01-01T00:00:00" || endTime === "0001-01-01T00:00:00") {
        return null;
    }
    let start = new Date(startTime);
    let end = new Date(endTime);

    let duration = end.getTime() - start.getTime();
    let second = 1000;
    let minute = second * 60;
    let hour = minute * 60;
    let day = hour * 24;

    let remainder = duration;
    let daysValue = Math.floor(remainder / day);
    remainder %= day;
    let hoursValue = Math.floor(remainder / hour);
    remainder %= hour;
    let minutesValue = Math.floor(remainder / minute);
    remainder %= minute;
    let secondsValue = Math.floor(remainder / second);

    if (semantic) {
        let str = "";
        if (days && daysValue > 0) {
            str += daysValue + "天";
        }
        if (hours && hoursValue > 0) {
            str += hoursValue + "时";
        }
        if (minutes && minutesValue > 0) {
            str += minutesValue + "分";
        }
        if (seconds && secondsValue > 0) {
            str += secondsValue + "秒";
        }
        return str;
    }
    return "{0}:{1}:{2}".format(daysValue, hoursValue, minutesValue);
}

export const GetQueryValue = (name: string) => {
    const url = window.location.href;
    const index = url.indexOf("?");
    if (index != -1) {
        const str = url.substr(index + 1);
        const strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            const p = strs[i].split("=");
            if (p[0] === name) {
                return decodeURI(p[1]);
            }
        }
    }
    return null;
}



export const assign = <T, U>(target: T, source: U): T & U => {
    if (source) {
        for (const key in target) {
            if (!(source as any).hasOwnProperty(key)) {
                (source as any)[key] = target[key];
            }
        }
        return source as T & U;
    } else {
        return target as T & U;
    }
}


export const formatNumber = (v: number) => {
    if (v > 10000) {
        return (v / 10000).toFixed(1) + "w";
    } else {
        return v;
    }
}

export default class {
    vue: Vue;
    uuid = uuid;
    loadData = loadData;
    today = today;
    toNow = toNow;
    yesterday = yesterday;
    age = age;
    duration = duration;
    formatNumber= formatNumber;

    private mTimeoutMap: Record<number, any> = {};

    constructor(vue: Vue) {
        this.vue = vue;
    }

    setTimeout(callback: () => void, ms: number, context: Vue) {
        if (!context) {
            return;
        }
        let id = context._uid;
        if (context._isBeingDestroyed) {
            delete this.mTimeoutMap[id];
            return;
        }
        let timeoutId = this.mTimeoutMap[id];
        if (id && timeoutId) {
            clearTimeout(timeoutId);
        }
        this.mTimeoutMap[id] = setTimeout(() => {
            delete this.mTimeoutMap[id];
            if (context._isBeingDestroyed) {
                return;
            }
            callback && callback();
        }, ms);
    }

    clearTimeout(context: Vue) {
        if (!context) {
            return;
        }
        let id = context._uid;
        if (id) {
            let timeoutId = this.mTimeoutMap[id];
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
        delete this.mTimeoutMap[id];
    }

}