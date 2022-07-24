import {WEEKLY, FORTNIGHTLY, MONTHLY, DAILY, MILI_SECONDS_PER_DAY} from '../constants.js';

export default function handleLedgerRequest(leaseStartDate, leaseEndDate, frequency, weeklyRent, timezone) {

    return generateLedger(leaseStartDate, leaseEndDate, frequency, weeklyRent, timezone);


    function generateLedger(leaseStartDate, leaseEndDate, frequency, weeklyRent, timezone) {
        let ledger = [];
        let nextStartDate = leaseStartDate;
        let nextEndDate = getNextEndDate(nextStartDate, frequency);
        let lineItem = [];

        while (leaseEndDate.getTime() > nextEndDate.getTime()) {
            lineItem = [nextStartDate.toDateString(), nextEndDate.toDateString(), getNextAmount(weeklyRent, frequency), ];

            ledger.push(lineItem);
            lineItem = [];

            nextStartDate = getNextStartDate(nextStartDate, frequency);
            nextEndDate = getNextEndDate(nextStartDate, frequency);
        }

        //Handling the last line item which falls beyond the given frequency interval.
        let dateDiff = getDateDiffInDays(leaseEndDate.getTime(), nextStartDate.getTime());
        nextEndDate = addDays(nextStartDate, dateDiff);

        lineItem = [nextStartDate.toDateString(), nextEndDate.toDateString(), getNextAmount(weeklyRent, DAILY, dateDiff + 1)]; //send freq = DAILY and using the same method to handle all scenarios. 
        ledger.push(lineItem);

        return ledger;
    }

    function getNextStartDate(nextStartDate, frequency) {
        let result = new Date(nextStartDate);

        switch (frequency) {
            case WEEKLY:
                result = addDays(result, 7);
                break;
            case FORTNIGHTLY:
                result = addDays(result, 14);
                break;
            case MONTHLY:
                result = addMonth(result);
                break;
            default:
        }
        return result;

    }
    
    //getNextStartDate and getNextEndDate can be one method with an additional parameter. 
    function getNextEndDate(nextStartDate, frequency) {
        let result = new Date(nextStartDate);

        switch (frequency) {
            case WEEKLY:
                result = addDays(result, 7);
                break;
            case FORTNIGHTLY:
                result = addDays(result, 14);
                break;
            case MONTHLY:
                result = addMonth(result);
                break;
            default:
        }
        result.setDate(result.getDate() - 1);
        return result;
    }

    function getNextAmount(weeklyRent, frequency, numberOfDays) {
        let lineAmount;

        switch (frequency) {
            case WEEKLY:
                lineAmount = weeklyRent;
                break;
            case FORTNIGHTLY:
                lineAmount = weeklyRent * 2;
                break;
            case MONTHLY:
                lineAmount = ((weeklyRent / 7) * (365 / 12));
                break;
            case DAILY:
                lineAmount = ((weeklyRent / 7) * numberOfDays);
                break;
        }
        return lineAmount.toFixed(2);
    }

    function addMonth(date) {
        let result = new Date(date);
        result.setMonth(result.getMonth() + 1);
        return result;
    }

    function addDays(date, days) {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function getDateDiffInDays(date1, date2) {
        return Math.ceil((date1 - date2) / MILI_SECONDS_PER_DAY);
    }
}