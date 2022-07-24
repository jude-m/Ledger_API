"use strict";

import express from 'express';
import handleLedgerRequest from './ledger/ledger-handler.js';
import validateQueryString from './ledger/ledger.js';

const app = express();
app.use(express.json());

app.get('/api/ledger', (req, res) => {
    const result = validateQueryString(req.query);  //This should be called within the handler and return any error here. 
    if (result.error) return res.status(400).send(result.error)

    const leaseStartDate = new Date(req.query.start_date);
    const leaseEndDate = new Date(req.query.end_date);
    const {
        frequency,
        weekly_rent: weeklyRent,
        timezone
    } = req.query;

    let fullSeries = handleLedgerRequest(leaseStartDate, leaseEndDate, frequency, weeklyRent, timezone); // The return should be more generic with status codes, etc. 
    res.send([fullSeries]);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`))























// const courses = [{
//         id: 1,
//         name: 'course 01'
//     },
//     {
//         id: 2,
//         name: 'course 02'
//     },
//     {
//         id: 3,
//         name: 'course 03'
//     },
// ]

// app.get('/api/courses', (req, res) => {
//     res.send(courses)
// })

// app.get('/api/courses/:id', (req, res) => {
//     const course = courses.find(c => c.id === parseInt(req.params.id))
//     if (!course) res.status(404).send('The course with the given ID was not found')
//     res.send(course)
// })

// app.post('/api/courses', (req, res) => {
//     const result = validateCourse(res.body)

//     if (result.error) {
//         res.status(400).send(result.error)
//         return
//     }

//     const course = {
//         id: courses.length + 1,
//         name: req.body.name
//     }

//     courses.push(course)
//     res.send(course)
// })

// app.put('/api/courses/:id', (req, res) => {
//     const course = courses.find(c => c.id === parseInt(req.params.id))
//     if (!course) res.status(404).send('The course with the given ID was not found')

//     const result = validateCourse(res.body)

//     if (result.error) {
//         res.status(400).send(result.error)
//         return
//     }

//     course.name = req.body.name
//     res.send(course)
// })

// function validateCourse(course) {
//     const schema = Joi.object({
//         name: Joi.string().min(3).required()
//     })

//     return schema.validate(course)
// }