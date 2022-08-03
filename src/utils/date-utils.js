"use strict";

export const DAILY = "DAILY";
export const WEEKLY = "WEEKLY";
export const FORTNIGHTLY = "FORTNIGHTLY";
export const MONTHLY = "MONTHLY";
export const MILI_SECONDS_PER_DAY = 1000 * 60 * 60 * 24;

//Had the dilemma  of returning null or undefined upon invalid date objects 
//after bit of reading seems undefined is better??? Need to read more..

export function addMonth(date) {
    if (isValidDate(date)) {
        let newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + 1);
        return newDate;
    }
}

export function addDays(date, days = 0) {
    if (isValidDate(date) && !isNaN(days)) {
        let newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }
}

export function getDateDiffInDays(firstDateInMs, secondDateInMs) {
    if (!isNaN(firstDateInMs) && !isNaN(secondDateInMs)) {
        return Math.ceil((firstDateInMs - secondDateInMs) / MILI_SECONDS_PER_DAY);
    }
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
    return `${getMonthName(this)} ${getDateOrdinal(this.getDate())}, ${this.getFullYear()}`;
}

function getDateOrdinal(day) {
    if (!isNaN(day)) {
        if (day > 3 && day < 21) return day + 'th';
        switch (day % 10) {
            case 1: return day + "st";
            case 2: return day + "nd";
            case 3: return day + "rd";
            default: return day + "th";
        }
    }
}

function getMonthName(date) {
    if (isValidDate(date)) {
        const newDate = new Date(date);
        return newDate.toLocaleString('default', { month: 'long' });
    }
}

function isValidDate(date) {
    return date instanceof Date && !isNaN(date);
}