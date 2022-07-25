export const WEEKLY = "WEEKLY";
export const FORTNIGHTLY = "FORTNIGHTLY";
export const MONTHLY = "MONTHLY";
export const DAILY = "DAILY";
export const MILI_SECONDS_PER_DAY = 1000 * 60 * 60 * 24;

export function addMonth(date) {
    let result = new Date(date);
    result.setMonth(result.getMonth() + 1);
    return result;
}

export function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function getDateDiffInDays(date1, date2) {
    return Math.ceil((date1 - date2) / MILI_SECONDS_PER_DAY);
}