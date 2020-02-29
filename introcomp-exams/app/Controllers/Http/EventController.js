'use strict'

/** @type {typeof import('../../Models/Event')} */
const Event = use('App/Models/Event')
const moment = require('moment')
const dateFormat = 'DD-MM-YYYY HH:mm'

class EventController {
  async store({ request, response, session }) {
    let { name, rules, start_date, end_date } = request.all()

    start_date = moment(`${start_date} 00:00`, dateFormat)
    end_date = moment(`${end_date} 23:59`, dateFormat)

    console.log(end_date)
    console.log(start_date)

    if (!start_date.isValid()) {
      session.flash({ error: 'Data de início inválida' })
      session.flashAll()

      return response.redirect('back')
    } else if (!start_date.isValid()) {
      session.flash({ error: 'Data de fim inválida' })
      session.flashAll()

      return response.redirect('back')
    } else if (start_date.isAfter(end_date)) {
      session.flash({ error: 'A data de início deve ser antes da data de fim' })
      session.flashAll()

      return response.redirect('back')
    } else if (start_date.isBefore(moment())) {
      session.flash({ error: 'O evento deve ocorrer no futuro' })
      session.flashAll()

      return response.redirect('back')
    }

    const event = new Event();
    event.name = name;
    event.rules = rules;
    event.start_date = formatDate(start_date);
    event.end_date = formatDate(end_date);

    try {
      await event.save()
      session.flash({ notification: 'Evento criado com sucesso' })
  
      return response.route('admin.menu')
    } catch (e) {
      console.log(e)

      return response.status(500)
    }

  }
}

module.exports = EventController

const formatDate = date => {
  return date
    .toISOString()
    .replace('T', ' ')
    .replace('Z', '')
}
