'use strict'

const User = use('App/Models/User')
const moment = require('moment')


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

    const user = await User.query().innerJoin('events', 'users.event_id', 'events.id').where({ email, role: 'STUDENT' }).andWhere('events.start_date', '<', formatDate(moment())).andWhere('events.end_date', '>', formatDate(moment())).first()

    try {
      await auth.login(user)
    } catch (e) {
      session.flashExcept(['email'])
      session.flash({ error: 'E-mail não encontrado!' })

      return response.route('student.index')
    }

    return response.route('exam.show')
  }

  async logout({ auth, response }) {
    await auth.logout()

    return response.route('student.index')
  }
}

module.exports = UserController


const formatDate = date => {
  return date.toISOString().replace('T', ' ').replace('Z', '')
}
