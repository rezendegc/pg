'use strict'

/*
|--------------------------------------------------------------------------
| DatabaseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const moment = require('moment')
const { formatDate } = require('../../utils/date')

class DatabaseSeeder {
  async run() {
    const event = await Factory.model('App/Models/Event').create()
    const schedule = await Factory.model('App/Models/ExamSchedule').make({ start: formatDate(moment()), end: formatDate(moment().add({ day: 5 })) })
    const student = await Factory.model('App/Models/User').make({ password: '123456' })
    const admin = await Factory.model('App/Models/User').make({ email: "admin", password: 'admin', role: "ADMIN" })
    const teacher = await Factory.model('App/Models/User').make({ password: '123456', role: "TEACHER" })

    await Factory.model('App/Models/Question').createMany(10, {
      difficulty: 1,
      correctAnswer: 1
    })
    await Factory.model('App/Models/Question').createMany(10, {
      difficulty: 2,
      correctAnswer: 2
    })
    await Factory.model('App/Models/Question').createMany(10, {
      difficulty: 3,
      correctAnswer: 3
    })
    await Factory.model('App/Models/Question').createMany(5, {
      difficulty: 4,
      correctAnswer: 4
    })


    await event.users().save(admin)
    await event.users().save(student)
    await event.users().save(teacher)
    await event.exam_schedules().save(schedule)
  }
}

module.exports = DatabaseSeeder
