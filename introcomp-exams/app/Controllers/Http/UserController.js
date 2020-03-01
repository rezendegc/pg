'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')
/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')
/** @type {typeof import('../../Models/Exam')} */
const Exam = use('App/Models/Exam')
/** @type {typeof import('../../Models/Question')} */
const Question = use('App/Models/Question')
/** @type {typeof import('../../Models/Event')} */
const Event = use('App/Models/Event')
const moment = require('moment')
const { formatDate } = require('../../../utils/date')

class UserController {
  index({ view }) {
    return view.render('student/index')
  }

  adminIndex({ view }) {
    return view.render('admin/login')
  }

  async login({ request, auth, session, response }) {
    const { email } = request.all()
    await auth.logout()

    const user = await User.query()
      .with('event', builder => {
        builder
          .where('start_date', '<', formatDate(moment()))
          .andWhere('end_date', '>', formatDate(moment()))
      })
      .where({ email, role: 'STUDENT' })
      .with('exam')
      .first()

    const userJSON = user && user.toJSON()
    if (userJSON && userJSON.exam && userJSON.exam.status) {
      if (userJSON.exam.status === 'FINISHED') {
        session.flashExcept(['email'])
        session.flash({ error: 'Usuário já finalizou a prova!' })

        return response.route('student.index')
      }
    }

    let event
    let schedule

    if (user) {
      event = await user.event().first()
      schedule =
        event != null
          ? await event
              .exam_schedules()
              .where('start_datetime', '<', formatDate(moment()))
              .andWhere('end_datetime', '>', formatDate(moment()))
              .first()
          : null

      if (!event || !schedule) {
        session.flashExcept(['email'])
        session.flash({ error: 'Não há provas acontecendo no momento!' })

        return response.route('student.index')
      }
    }

    try {
      if (user) await auth.login(user)
      else throw Error('No user found')
    } catch (e) {
      console.debug(e)

      session.flashExcept(['email'])
      session.flash({ error: 'E-mail não encontrado!' })

      return response.route('student.index')
    }

    if ((await user.exam().first()) == null) {
      const exam = new Exam()
      exam.exam_schedule_id = schedule.id
      exam.user_id = user.id
      await exam.event().associate(event)

      const amountEasy = Env.get('EASY_QUESTIONS', 5)
      const amountMedium = Env.get('MEDIUM_QUESTIONS', 5)
      const amountHard = Env.get('HARD_QUESTIONS', 4)
      const amountSpecial = Env.get('SPECIAL_QUESTIONS', 1)

      const easyQuestions = await Question.query()
        .where({ difficulty: 1 })
        .orderByRaw('RAND()')
        .limit(amountEasy)
        .fetch()
      const mediumQuestions = await Question.query()
        .where({ difficulty: 2 })
        .orderByRaw('RAND()')
        .limit(amountMedium)
        .fetch()
      const hardQuestions = await Question.query()
        .where({ difficulty: 3 })
        .orderByRaw('RAND()')
        .limit(amountHard)
        .fetch()
      const specialQuestions = await Question.query()
        .where({ difficulty: 4 })
        .orderByRaw('RAND()')
        .limit(amountSpecial)
        .fetch()

      let questionIds = []
      easyQuestions.rows.forEach(element => {
        questionIds.push(element.id)
      })
      mediumQuestions.rows.forEach(element => {
        questionIds.push(element.id)
      })
      hardQuestions.rows.forEach(element => {
        questionIds.push(element.id)
      })
      specialQuestions.rows.forEach(element => {
        questionIds.push(element.id)
      })

      const shuffle = array => {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));

          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      
      shuffle(questionIds)

      await exam.questions().attach(questionIds)
    }

    return response.route('exam.waiting')
  }

  async adminLogin({ request, auth, session, response }) {
    const { email, password } = request.all()
    await auth.logout()

    try {
      await auth.attempt(email, password)
    } catch (e) {
      console.debug(e)

      session.flashExcept(['invalidLogin'])
      session.flash({ error: 'E-mail ou senha inválidos!' })

      return response.route('admin.index')
    }

    return response.route('admin.menu')
  }

  async logout({ auth, response }) {
    await auth.logout()

    return response.route('student.index')
  }

  async show({ view }) {
    const events = await Event.query()
      .where('end_date', '>', formatDate(moment()))
      .fetch()

    return view.render('admin/create_user', { events: events && events.toJSON() })
  }
}

module.exports = UserController