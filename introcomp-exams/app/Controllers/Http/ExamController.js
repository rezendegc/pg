'use strict'

const moment = require('moment')

class ExamController {
  async show({ view, auth, response }) {
    const exam = await auth.user.exam().first()
    const schedule = await exam.schedule().first()
    const questions = await exam.questions().fetch()
    const event = await exam.event().first()

    /* This part is here to not allow student to enter
     * exam before it has actually started
     */
    const start = moment(schedule.start_datetime)
    const resisterString = schedule.register_time
    const registerTime = resisterString.split(':')
    start.add(registerTime[0], 'h')
    start.add(registerTime[1], 'm')
    start.add(registerTime[2], 's')

    if (start.isAfter(moment())) {
      if (exam.status !== 'WAITING') {
        exam.status = 'WAITING'
        await exam.save()
      }

      return response.route('exam.waiting')
    }

    if (exam.status === 'WAITING') {
      exam.status = 'DOING'
      await exam.save()
    }

    if (exam.status === 'DOING') {
      return view.render('student/exam', { schedule, questions: questions.toJSON(), seed: auth.user.id, rules: event.rules })
    } else {
      return response.route('student.logout')
    }
  }

  async waitingStart({ view, auth, response }) {
    const exam = await auth.user.exam().first()
    const event = await exam.event().first()
    const schedule = await exam.schedule().first()

    if (exam.status === 'DOING') {
      return response.route('exam.show')
    } else if (exam.status === 'FINISHED') {
      return response.route('exam.finished')
    } else {
      return view.render('student/waiting', { schedule: schedule.toJSON(), rules: event.rules })
    }

  }

  async finished({ view, auth }) {
    const exam = await auth.user.exam().first()

    if (exam.status !== 'FINISHED') {
      exam.status = 'FINISHED'
      await exam.save()
    }

    return view.render('student/finished')
  }
}

module.exports = ExamController
