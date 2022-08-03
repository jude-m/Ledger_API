"use strict";
import * as dateUtils from '../src/utils/date-utils.js';

describe("Testing addMonth()", () => {
    it("Addng a month", () => {
        const inputDate = new Date('2023-01-28');
        const outputDate = new Date('2023-02-28');
        expect(dateUtils.addMonth(inputDate)).toEqual(outputDate);
    });

    it("Adding a month on the last day - 31st", () => {
        const inputDate = new Date('2023-08-31');
        const outputDate = new Date('2023-10-01');
        expect(dateUtils.addMonth(inputDate)).toEqual(outputDate);
    });

    it("Invalid date input", () => {
        const inputDate = new Date('2023-01-28ss');
        expect(dateUtils.addMonth(inputDate)).toBeUndefined();
    });
})

describe("Testing addDays()", () => {
    it("Addng days", () => {
        const inputDate = new Date('2023-01-28');
        const inputDays = 6;
        const outputDate = new Date('2023-02-03');
        expect(dateUtils.addDays(inputDate, inputDays)).toEqual(outputDate);
    });
    it("Addng days in a leap year on the last day of Feb", () => {
        const inputDate = new Date('2024-02-28');
        const inputDays = 2;
        const outputDate = new Date('2024-03-01');
        expect(dateUtils.addDays(inputDate, inputDays)).toEqual(outputDate);
    });
    it("Addng zero days", () => {
        const inputDate = new Date('2025-02-28');
        const inputDays = 0;
        const outputDate = new Date('2025-02-28');
        expect(dateUtils.addDays(inputDate, inputDays)).toEqual(outputDate);
    });
    it("Adding negative days", () => {
        const inputDate = new Date('2025-02-28');
        const inputDays = -5;
        const outputDate = new Date('2025-02-23');
        expect(dateUtils.addDays(inputDate, inputDays)).toEqual(outputDate);
    });
    it("Skipping inputDays", () => {
        const inputDate = new Date('2025-02-28');
        const inputDays = -5;
        const outputDate = new Date('2025-02-28');
        expect(dateUtils.addDays(inputDate)).toEqual(outputDate);
    });
    it("Invalid date input", () => {
        const inputDate = new Date('2025-02-28xxx');
        const inputDays = 4;
        expect(dateUtils.addDays(inputDate, inputDays)).toBeUndefined();
    });
})

describe("Testing getDateDiffInDays()", () => {
    it("Postive difference", () => {
        const date1 = new Date('2023-03-01').getTime();
        const date2 = new Date('2023-02-24').getTime();
        expect(dateUtils.getDateDiffInDays(date1, date2)).toBe(5);
    });

    it("Negative difference", () => {
        const date1 = new Date('2023-02-01').getTime();
        const date2 = new Date('2023-02-10').getTime();
        expect(dateUtils.getDateDiffInDays(date1, date2)).toBe(-9);
    });

    it("Difference between the same day", () => {
        const date1 = new Date().getTime();
        const date2 = new Date().getTime();
        expect(dateUtils.getDateDiffInDays(date1, date2)).toBe(0);
    });

    it("Invalid date input", () => {
        const date1 = new Date('2023-01-28sss').getTime();
        const date2 = new Date('2023-02-10').getTime();
        expect(dateUtils.getDateDiffInDays(date1, date2)).toBeUndefined();
    });
})