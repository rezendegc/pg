'use strict'

/** @type {typeof import('../../Models/Event')} */
const Event = use('App/Models/Event')
const moment = require('moment')
const { formatDate } = require('../../../utils/date')
const dateFormat = 'DD-MM-YYYY HH:mm'

class EventController {
  async store({ request, response, session }) {
    let { name, rules, start_date, end_date } = request.all()

    start_date = moment(`${start_date} 00:00`, dateFormat)
    end_date = moment(`${end_date} 23:59`, dateFormat)

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

    const eventsResult = await Event.query()
      .where(builder =>
        builder
          .where('start_date', '>=', formatDate(start_date))
          .andWhere('start_date', '<=', formatDate(end_date))
      )
      .orWhere(builder =>
        builder
          .where('start_date', '<=', formatDate(start_date))
          .andWhere('end_date', '>=', formatDate(start_date))
      )
      .fetch()

    if (
      eventsResult &&
      eventsResult.toJSON() &&
      eventsResult.toJSON().length > 0
    ) {
      session.flash({ error: 'Já existe um evento nessa data' })
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

  async list({ view }) {
    const events = await Event.query().where('start_date', '>', formatDate(moment())).fetch();

    return view.render('admin/list_events', { events: events && events.toJSON() })
  }

  async delete({ request, response, session }) {
    const { events } = request.all();
    if (!events) return response.route('admin.menu')

    await Event.query().whereIn('id', events).delete();
    
    session.flash({ notification: 'Eventos apagados com sucesso' })
  
    return response.route('admin.menu')
  }
}

module.exports = EventController