'use strict'

class ExamController {
  show({ view }) {
    return view.render('student/exam')
  }
}

module.exports = ExamController
