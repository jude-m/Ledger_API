"use strict";

const Joi = require('joi');
const express = require('express');
const {
    WEEKLY,
    FORTNIGHTLY,
    MONTHLY,
    MILI_SECONDS_PER_DAY,
    DAILY
} = require('./constants');
const app = express();

app.use(express.json());

app.get('/api/ledger', (req, res) => {
    const result = validateQueryString(req.query);
    if (result.error) return res.status(400).send(result.error)

    const leaseStartDate = new Date(req.query.start_date);
    const leaseEndDate = new Date(req.query.end_date);
    const {
        frequency,
        weekly_rent: weeklyRent,
        timezone
    } = req.query;

    let fullSeries = [];
    let nextStartDate = leaseStartDate;
    let nextEndDate = getNextEndDate(nextStartDate, frequency);
    let lineItem = [];

    while (leaseEndDate.getTime() > nextEndDate.getTime()) {
        lineItem = [nextStartDate.toDateString(), nextEndDate.toDateString(), getNextAmount(weeklyRent, frequency), ];

        fullSeries.push(lineItem);
        lineItem = [];

        nextStartDate = getNextStartDate(nextStartDate, frequency);
        nextEndDate = getNextEndDate(nextStartDate, frequency);
    }

    //Handling the last line item which falls beyond the given frequency interval.
    let dateDiff = getDateDiffInDays(leaseEndDate.getTime(), nextStartDate.getTime());
    nextEndDate = addDays(nextStartDate, dateDiff);

    lineItem = [nextStartDate.toDateString(), nextEndDate.toDateString(), getNextAmount(weeklyRent, DAILY, dateDiff + 1)]; //send freq = DAILY

    fullSeries.push(lineItem);
    res.send([fullSeries]);
})

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

    // if (result.getDate() != date.getDate()) {
    //     result.setDate(0);
    // }
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

function validateQueryString(query) {
    const schema = Joi.object({
        start_date: Joi.date().greater('now').required(), //assuming start_date cannot be in the past    //check whether dates are UTC   //Test for Feb // check date are valid, eg: 31 Nov
        end_date: Joi.date().greater(Joi.ref('start_date')).required(),
        weekly_rent: Joi.number().integer().greater(0).required(), //assuming weekly_rent is a whole number
        frequency: Joi.string().valid(WEEKLY, FORTNIGHTLY, MONTHLY).required(),
        timezone: Joi.string() //validation not done yet
    })

    return schema.validate(query);
}





















const courses = [{
        id: 1,
        name: 'course 01'
    },
    {
        id: 2,
        name: 'course 02'
    },
    {
        id: 3,
        name: 'course 03'
    },
]

app.get('/api/courses', (req, res) => {
    res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) res.status(404).send('The course with the given ID was not found')
    res.send(course)
})

app.post('/api/courses', (req, res) => {
    const result = validateCourse(res.body)

    if (result.error) {
        res.status(400).send(result.error)
        return
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course)
    res.send(course)
})

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) res.status(404).send('The course with the given ID was not found')

    const result = validateCourse(res.body)

    if (result.error) {
        res.status(400).send(result.error)
        return
    }

    course.name = req.body.name
    res.send(course)
})

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    return schema.validate(course)
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`))