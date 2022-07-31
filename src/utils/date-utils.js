"use strict";

export const DAILY = "DAILY";
export const WEEKLY = "WEEKLY";
export const FORTNIGHTLY = "FORTNIGHTLY";
export const MONTHLY = "MONTHLY";
export const MILI_SECONDS_PER_DAY = 1000 * 60 * 60 * 24;

export function addMonth(date) {
    let newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    return newDate;
}

export function addDays(date, days) {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

export function getDateDiffInDays(date1, date2) {
    return Math.ceil((date1 - date2) / MILI_SECONDS_PER_DAY);
}

export function isValidTimeZone(value, helpers) {
    if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
        return helpers.error("any.invalid");
    }

    try {
        Intl.DateTimeFormat(undefined, { timeZone: value });
        return value;
    }
    catch (error) {
        return helpers.error("any.invalid");
    }
}

//Monkey patching only to try out. This is not always a good practice. 
Date.prototype.toCustomDateString = function () {
    return `${getMonthName(this.getDate())} ${getDateOrdinal(this.getDate())}, ${this.getFullYear()}`;
}

function getDateOrdinal(date) {
    let s = ["th", "st", "nd", "rd"];
    let v = date % 100;
    return date + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getMonthName(date) {
    const newDate = new Date(date);
    return newDate.toLocaleString('default', { month: 'long' });
}