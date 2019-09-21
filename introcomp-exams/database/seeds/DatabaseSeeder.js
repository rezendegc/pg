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

class DatabaseSeeder {
  async run() {
    const event = await Factory.model('App/Models/Event').create()
    const schedule = await Factory.model('App/Models/ExamSchedule').make({ start: formatDate(moment()), end: formatDate(moment().add({ day: 5 })) })
    const student = await Factory.model('App/Models/User').make({ password: '123456' })
    const admin = await Factory.model('App/Models/User').make({ password: '123456', role: "ADMIN" })
    const teacher = await Factory.model('App/Models/User').make({ password: '123456', role: "TEACHER" })

    await event.users().save(admin)
    await event.users().save(student)
    await event.users().save(teacher)
    await event.exam_schedules().save(schedule)
  }
}


const formatDate = date => {
  return date.toISOString().replace('T', ' ').replace('Z', '')
}

module.exports = DatabaseSeeder
