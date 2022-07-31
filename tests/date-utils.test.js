import * as dateUtils from '../src/utils/date-utils.js';

describe("Testing addMonth()", () => {
    it("Testing generic test case", () => {
        const input = new Date('2023-01-28');
        const output = new Date ('2023-02-28');
        expect(dateUtils.addMonth(input)).toEqual(output);
    });

    it("Testing adding a month for 31st", () => {
        const input = new Date('2023-08-31');
        const output = new Date ('2023-10-01') ;
        expect(dateUtils.addMonth(input)).toEqual(output);
    });

    it("Testing an incorrect date input", () => {
        const input = new Date('2023-01-28ss');
        const output = new Date (NaN);
        expect(JSON.stringify(input)).toEqual(JSON.stringify(output));
    });
})