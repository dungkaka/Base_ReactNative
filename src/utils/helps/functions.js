import { Int } from "./number";

export const objectClean = (object, allowNull = true) => {
    const newObject = { ...object };
    Object.keys(newObject).forEach(function (key) {
        if (newObject[key] == undefined || (!allowNull && object[key] == null)) {
            delete newObject[key];
        }
    });

    return newObject;
};

export const arrayClean = (array, allowNull = false) => {
    return array.filter((el) => {
        if (allowNull) return el !== undefined;
        else return el !== undefined && el !== null;
    });
};

export const emptyObject = {};

export const emptyFunc = () => {};

export function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

export function numberWithCommas(x, character = ".") {
    return Int(x)
        ?.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, character);
}

export function round(x) {
    return Math.round(x);
}

export function round2(x) {
    return Math.round(x * 100) / 100;
}

export function isUndefined(value) {
    return value !== undefined;
}

export function isString(obj) {
    return Object.prototype.toString.call(obj) === "[object String]";
}

export const delay = (m) => new Promise((r) => setTimeout(r, m));

export const checkKeyMemo = (prevArray, nextArray) => {
    if (!Array.isArray(nextArray)) return false;
    for (let i = 0; i < nextArray.length; i++) {
        if (nextArray[i] != prevArray[i]) return false;
    }
    return true;
};

export const mergeStyle = (stylesOne, stylesTwo) => {
    const newStyle = {};
    for (let style in stylesOne) {
        newStyle[style] = { ...stylesOne[style], ...stylesTwo[style] };
    }
    return newStyle;
};

export const throttle = (lockRef, callback, limit) => {
    if (lockRef.current) return;

    callback();
    lockRef.current = true;
    setTimeout(function () {
        lockRef.current = false;
    }, limit);
};

export const debounce = function (timeOutRef, callback, delay) {
    if (timeOutRef.current) clearTimeout(timeOutRef.current);
    timeOutRef.current = setTimeout(callback, delay);
    return () => {
        if (timeOutRef.current) clearTimeout(timeOutRef.current);
    };
};

export const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
};
