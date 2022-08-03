"use strict";
import joiBase from 'joi';
import joiDate from '@joi/date';

import generateLedger from "../services/ledger-service.js";
import { FORTNIGHTLY, isValidTimeZone, MONTHLY, WEEKLY } from '../utils/date-utils.js';

export default function getLedger(req, res) {
    const result = validateQueryString(req.query);
    if (result.error) return res.status(400).send(result.error);

    const leaseStartDate = new Date(req.query.start_date);
    const leaseEndDate = new Date(req.query.end_date);
    const { frequency, weekly_rent: weeklyRent, timezone } = req.query;

    let ledger = generateLedger(leaseStartDate, leaseEndDate, frequency, weeklyRent, timezone); // The return can be more rich with status codes, etc. 
    res.status(200).send([ledger]);
}

function validateQueryString(query) {
    const joi = joiBase.extend(joiDate);
    const schema = joi.object({
        start_date: joi.date().format('YYYY-MM-DD').greater('now').required(), //assuming start_date cannot be in the past.
        end_date: joi.date().format('YYYY-MM-DD').greater(joi.ref('start_date')).required(),
        weekly_rent: joi.number().integer().greater(0).required(), //assuming weekly_rent is a whole number
        frequency: joi.string().valid(WEEKLY, FORTNIGHTLY, MONTHLY).required(),
        timezone: joi.string().required().custom(isValidTimeZone)
    });

    return schema.validate(query);
}

