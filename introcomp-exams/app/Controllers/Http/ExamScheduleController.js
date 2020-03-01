'use strict'

/** @type {typeof import('../../Models/Event')} */
const Event = use('App/Models/Event')
/** @type {typeof import('../../Models/ExamSchedule')} */
const ExamSchedule = use('App/Models/ExamSchedule')
const { formatDate } = require('../../../utils/date')
const moment = require('moment')
const dateFormat = 'DD-MM-YYYY HH:mm'

class ExamScheduleController {
  async showCreate({ view }) {
    const events = await Event.query()
      .where('end_date', '>', formatDate(moment()))
      .fetch()

    return view.render('admin/create_schedule', { events: events.toJSON() })
  }

  async store({ request, response, session }) {
    const { date, time, duration, eventId, register_time } = request.all()

    const eventFetched = await Event.find(eventId)
    if (!eventFetched) {
      session.flash({ error: 'Evento não encontrado' })
      session.flashAll()

      return response.redirect('back')
    }

    const event_start = moment(eventFetched.start_date)
    const event_end = moment(eventFetched.end_date)

    const [hours, minutes] = duration.split(':')
    const start_datetime = moment(`${date} ${time}`, dateFormat)
    const end_datetime = moment(`${date} ${time}`, dateFormat)
    end_datetime.add(hours, 'hours')
    end_datetime.add(minutes, 'minutes')

    if (!start_datetime.isValid()) {
      session.flash({ error: 'Data de início inválida' })
      session.flashAll()

      return response.redirect('back')
    } else if (!start_datetime.isValid()) {
      session.flash({ error: 'Data de fim inválida' })
      session.flashAll()

      return response.redirect('back')
    } else if (start_datetime.isAfter(end_datetime)) {
      session.flash({ error: 'A data de início deve ser antes da data de fim' })
      session.flashAll()

      return response.redirect('back')
    } else if (start_datetime.isBefore(moment())) {
      session.flash({ error: 'A prova deve ocorrer no futuro' })
      session.flashAll()

      return response.redirect('back')
    } else if (
      start_datetime.isAfter(event_end) ||
      start_datetime.isBefore(event_start) ||
      end_datetime.isAfter(event_end)
    ) {
      session.flash({ error: 'A prova deve ocorrer dentro da data do evento' })
      session.flashAll()

      return response.redirect('back')
    }

    const schedulesResult = await ExamSchedule.query()
      .where(builder =>
        builder
          .where('start_datetime', '>=', formatDate(start_datetime))
          .andWhere('start_datetime', '<=', formatDate(end_datetime))
      )
      .orWhere(builder =>
        builder
          .where('start_datetime', '<=', formatDate(start_datetime))
          .andWhere('end_datetime', '>=', formatDate(start_datetime))
      )
      .fetch()

    if (
      schedulesResult &&
      schedulesResult.toJSON() &&
      schedulesResult.toJSON().length > 0
    ) {
      session.flash({ error: 'Já existe uma prova nesse horário' })
      session.flashAll()

      return response.redirect('back')
    }

    try {
      const schedule = await ExamSchedule.create({
        start_datetime: formatDate(start_datetime),
        end_datetime: formatDate(end_datetime),
        register_time: `00:${register_time}:00`,
        event_id: eventId
      })

      session.flash({ notification: 'Prova agendada com sucesso' })
      return response.route('admin.menu')
    } catch (e) {
      console.log(e)

      return response.status(500)
    }
  }

  async list({ view }) {
    const schedulesFetch = await ExamSchedule.query()
      .where('start_datetime', '>', formatDate(moment()))
      .with('event')
      .fetch()
    const schedules = schedulesFetch.toJSON().map(e => {
      e.register_time = e.register_time.split(':')[1]
      return e
    })

    return view.render('admin/list_schedule', { schedules: schedules })
  }
}

module.exports = ExamScheduleController
