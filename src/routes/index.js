"use strict";

import express from 'express';
import getLedger from '../controllers/ledger-controller.js'

const router = express.Router();
export default router;

router.get('/ledger', getLedger);

























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