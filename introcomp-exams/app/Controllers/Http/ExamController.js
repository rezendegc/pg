'use strict'

class ExamController {
  show({ view }) {
    return view.render('student/exam')
  }

  waitingStart({ view }) {
    return view.render('student/waiting')
  }
}

module.exports = ExamController
