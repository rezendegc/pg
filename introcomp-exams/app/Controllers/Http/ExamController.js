'use strict'

/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')
/** @type {typeof import('../../Models/Exam')} */
const Exam = use('App/Models/Exam')
/** @type {typeof import('../../Models/Event')} */
const Event = use('App/Models/Event');
const { formatDate } = require('../../../utils/date')
const moment = require('moment')
const Helpers = use('Helpers')
const Drive = use('Drive')

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
      return view.render('student/exam', {
        schedule,
        questions: questions.toJSON(),
        seed: auth.user.id,
        rules: event.rules
      })
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
      return view.render('student/waiting', {
        schedule: schedule.toJSON(),
        rules: event.rules
      })
    }
  }

  async finished({ view, auth }) {
    const exam = await auth.user.exam().with('questions').first()

    if (exam.status !== 'FINISHED') {
      let grade = 0;
      const wrongValue = Number(process.env.WRONG_ANSWER_VALUE);
      const correctValue = Number(process.env.RIGHT_ANSWER_VALUE);
      const examJSON = exam.toJSON();

      examJSON.questions.forEach(e => {
        if (e.pivot.answer == '1') {
          grade += correctValue;
        } else if (e.pivot.answer != null) {
          grade += wrongValue
        }
      });
      

      exam.grade = grade;
      exam.status = 'FINISHED';

      await exam.save()
    }

    await auth.logout()

    return view.render('student/finished')
  }

  async list({ view }) {
    const users = await User.query().has('exam').with('event')
      .with('exam', builder => {
        builder.where({ status: 'FINISHED' })
      })
      .andWhere({ role: 'STUDENT' })
      .fetch()

    return view.render('admin/list_exams', { users: users && users.toJSON() })
  }

  async viewEnded({ view, params, response }) {
    const { id } = params;
    const user = await User.query().with('exam', builder => builder.with('questions')).where({ id }).first();

    return view.render('admin/finished_exam', {
      seed: user.id,
      questions: user.toJSON().exam.questions
    });
  }

  async grades({ view }) {
    const events = await Event.query().where('end_date', '<', formatDate(moment())).fetch();

    return view.render('admin/grades', { events: events.toJSON() })
  }

  async exportGrades({ response, request }) {
    const { eventId: id } = request.all();

    const usersFetch = await Event.query().where({ id }).with('users', usersBuilder => {
      usersBuilder.with('exam')
    }).first();
    // get all users from event
    const { users } = usersFetch.toJSON();
    // filter only users that made the exam
    const filteredUsers = users.filter(e => e.exam);
    // filter only users which exams hasn't been checked yet
    const gradelessUsers = filteredUsers.filter(e => !e.exam.grade || e.exam.status !== 'FINISHED');
    // calculate all remaining grades
    for (const user of gradelessUsers) {
      const examFetched = await Exam.query().where('id', user.exam.id).with('questions').first();
      const exam = examFetched.toJSON();

      let grade = 0;
      const wrongValue = Number(process.env.WRONG_ANSWER_VALUE);
      const correctValue = Number(process.env.RIGHT_ANSWER_VALUE);

      exam.questions.forEach(e => {
        if (e.pivot.answer == '1') {
          grade += correctValue;
        } else if (e.pivot.answer != null) {
          grade += wrongValue
        }
      });

      examFetched.grade = grade;
      examFetched.status = 'FINISHED';

      await examFetched.save();

      filteredUsers.forEach(e => {if (e.id === user.id) e.exam = examFetched.toJSON()});
    };
    
    
    const fileName = 'Notas ' + moment().format('YYYY-MM-DD HH:mm:ss') + '.csv';
    const headers = 'Nome,CPF,Turno,Escola,Nota\n';
    const body = filteredUsers.map(e => `${e.name},${e.cpf},${e.shift},${e.school},${e.exam.grade}`);
    
    await Drive.put(fileName, Buffer.from(headers+body.join('\n')))
    return response.attachment(
      Helpers.tmpPath(fileName)
    )
  }
}

module.exports = ExamController
