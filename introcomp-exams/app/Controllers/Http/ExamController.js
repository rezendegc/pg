'use strict'

/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')

class ExamController {
  async show({ view, auth }) {
    const exam = await auth.user.exam().first()
    const schedule = await exam.schedule().first()
    const questions = await exam.questions().fetch()
    const event = await exam.event().first()

    return view.render('student/exam', { schedule, questions: questions.toJSON(), seed: auth.user.id, rules: event.rules })
  }

  async waitingStart({ view, auth }) {
    const exam = await auth.user.exam().first()
    const event = await exam.event().first()
    const schedule = await exam.schedule().first()

    return view.render('student/waiting', { schedule: schedule.toJSON(), rules: event.rules })
  }

  finished({ view }) {
    return view.render('student/finished')
  }
}

module.exports = ExamController
