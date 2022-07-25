import Joi from 'joi';
import {WEEKLY, FORTNIGHTLY, MONTHLY} from '../utils/date-utils.js';
import generateLedger from "../services/ledger-service.js";

export default function getLedger (req, res) {
    const result = validateQueryString(req.query);  //This should be called within the handler and return any error here. 
    if (result.error) return res.status(400).send(result.error)

    const leaseStartDate = new Date(req.query.start_date);
    const leaseEndDate = new Date(req.query.end_date);
    const {
        frequency,
        weekly_rent: weeklyRent,
        timezone
    } = req.query;

    let ledger = generateLedger(leaseStartDate, leaseEndDate, frequency, weeklyRent, timezone); // The return should be more generic with status codes, etc. 
    res.send([ledger]);
}

function validateQueryString(query) {
    const schema = Joi.object({
        start_date: Joi.date().greater('now').required(), //assuming start_date cannot be in the past    //check whether dates are UTC   //Test for Feb // check date are valid, eg: 31 Nov
        end_date: Joi.date().greater(Joi.ref('start_date')).required(),
        weekly_rent: Joi.number().integer().greater(0).required(), //assuming weekly_rent is a whole number
        frequency: Joi.string().valid(WEEKLY, FORTNIGHTLY, MONTHLY).required(),
        timezone: Joi.string() //validation not done yet
    });

    return schema.validate(query);
}
