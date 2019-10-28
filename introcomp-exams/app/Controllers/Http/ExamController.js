'use strict'

/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')

class ExamController {
  show({ view }) {
    return view.render('student/exam')
  }

  async waitingStart({ view, auth }) {
    const exam = await auth.user.exam().first()
    const schedule = await exam.schedule().first()

    return view.render('student/waiting', { schedule: schedule.toJSON() })
  }

  finished({ view }) {
    return view.render('student/finished')
  }
}

module.exports = ExamController
