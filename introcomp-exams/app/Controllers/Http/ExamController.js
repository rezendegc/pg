'use strict'

/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')

class ExamController {
  async show({ view, auth }) {
    const exam = await auth.user.exam().first()
    const schedule = await exam.schedule().first()
    const questions = await exam.questions().fetch()
    const answers = await exam.questions().fetch()

    return view.render('student/exam', { schedule, questions: questions.toJSON(), seed: auth.user.id })
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
