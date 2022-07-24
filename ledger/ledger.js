import Joi from 'joi';
import {WEEKLY, FORTNIGHTLY, MONTHLY} from '../constants.js';

export default function validateQueryString(query) {
    const schema = Joi.object({
        start_date: Joi.date().greater('now').required(), //assuming start_date cannot be in the past    //check whether dates are UTC   //Test for Feb // check date are valid, eg: 31 Nov
        end_date: Joi.date().greater(Joi.ref('start_date')).required(),
        weekly_rent: Joi.number().integer().greater(0).required(), //assuming weekly_rent is a whole number
        frequency: Joi.string().valid(WEEKLY, FORTNIGHTLY, MONTHLY).required(),
        timezone: Joi.string() //validation not done yet
    })

    return schema.validate(query);
}