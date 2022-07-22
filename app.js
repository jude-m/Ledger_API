const Joi = require('joi');
const express = require('express');
const { WEEKLY, FORTNIGHTLY, MONTHLY, MILI_SECONDS_PER_DAY } = require('./constants');
const app = express();

app.use(express.json());

app.get('/api/ledger', (req, res) => {
    // const result = validateQueryString(req.query);
    // if (result.error) return res.status(400).send(result.error)

    const leaseStartDate = new Date(req.query.start_date);
    const leaseEndDate = new Date(req.query.end_date);
    const { frequency, weekly_rent:weeklyRent, timezone } = req.query;

    let fullSeries = [];
    let frequencyInDays = frequency === WEEKLY ? 7 : frequency === FORTNIGHTLY ? 13 : 30;
    let rentMulti = frequency === WEEKLY ? 1 : frequency === FORTNIGHTLY ? 2 : 4;

    let nextLineItemStartDate = leaseStartDate;
    let nextLineItemEndDate = addDays(nextLineItemStartDate, frequencyInDays);
    let line_item = [];

    while (leaseEndDate.getTime() > nextLineItemEndDate.getTime() ) {
        line_item.push(nextLineItemStartDate.toDateString());
        line_item.push(nextLineItemEndDate.toDateString());
        line_item.push(weeklyRent * rentMulti);

        fullSeries.push(line_item);
        line_item = [];

        nextLineItemStartDate = addDays(nextLineItemEndDate, 1);
        nextLineItemEndDate = addDays(nextLineItemStartDate, frequencyInDays);
    }

    //Handling the last line item which is less
    let dateDiff = dateDiffInDays(leaseEndDate.getTime(), nextLineItemStartDate.getTime());
    line_item.push(nextLineItemStartDate.toDateString());
    line_item.push(addDays(nextLineItemStartDate, dateDiff).toDateString());
    line_item.push(rentPerNumberOfDays(weeklyRent, dateDiff));

    fullSeries.push(line_item);

    res.send([fullSeries]);

})

function rentPerNumberOfDays(weeklyRent, numberOfdays){
    return ((weeklyRent/7) * numberOfdays).toFixed(2);
}

function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function dateDiffInDays(date1, date2) {
    return Math.floor((date1 - date2) / MILI_SECONDS_PER_DAY);
}

function validateQueryString(query) {
    const schema = Joi.object({
        start_date:Joi.date().greater('now').required(),                //assuming start_date cannot be in the past    //check whether dates are UTC   //Test for Feb
        end_date:Joi.date().greater(Joi.ref('start_date')).required(),
        weekly_rent:Joi.number().integer().greater(0).required(),       //assuming the rent is a whole number
        frequency: Joi.string().valid(WEEKLY,FORTNIGHTLY,MONTHLY).required(),
        timezone: Joi.string()                                          //validation not done yet
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