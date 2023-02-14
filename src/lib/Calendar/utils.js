import { time } from "@utils/helps/time";

const startYear = 1960;
export const years = new Array(new Date().getFullYear() - startYear + 1)
    .fill(0)
    .map((_, i) => {
        const value = startYear + i;
        return { value, label: `${value}` };
    })
    .reverse();
export const days = new Array(31).fill(0).map((_, i) => ({ value: i + 1, label: `${i + 1}` }));
export const months = new Array(12).fill(0).map((_, i) => ({ value: i + 1, label: `${i + 1}` }));
export const hours = new Array(24).fill(0).map((_, i) => ({ value: i, label: `${i}` }));
export const minutes = new Array(60).fill(0).map((_, i) => ({ value: i, label: `${i}` }));

export const dateToday = time().toDateObject();

export const validateDate = (mode, year, month, day) => {
    switch (mode) {
        case "hour":
        case "minute":
        case "day": {
            var d = new Date(year, month - 1, day);
            if (d.getFullYear() == year && d.getMonth() == month - 1 && d.getDate() == day) {
                return true;
            }
            return undefined;
        }

        case "month": {
            var d = new Date(year, month - 1, 1);
            if (d.getFullYear() == year && d.getMonth() == month - 1) {
                return true;
            }
            return undefined;
        }

        case "year": {
            var d = new Date(year, 1, 1);
            if (d.getFullYear() == year) {
                return true;
            }
            return undefined;
        }
        default:
            return undefined;
    }
};

export const MODE = {
    second: 1,
    minute: 2,
    hour: 3,
    day: 4,
    month: 5,
    year: 6,
};
