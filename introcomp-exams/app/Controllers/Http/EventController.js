'use strict'

/** @type {typeof import('../../Models/Event')} */
const Event = use('App/Models/Event')
/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')
const moment = require('moment')
const { formatDate } = require('../../../utils/date')
const dateFormat = 'DD-MM-YYYY HH:mm'
const Helpers = use('Helpers')
const fs = require('fs')

const _parseCSV = (csvString) => {
  const rows = csvString.split('\n')
  const headers = rows.shift().split(',');

  return rows.map(row => {
    const fields = [];
    let word = '';
    let isOnString = false;
    row.split('').forEach(letter => {
      if (letter === ',') {
        if (!isOnString) {
          fields.push(word);
          word = '';
        }
      } else if (letter === '"') {
        isOnString = !isOnString;
      } else {
        word += letter;
      }
    });
    fields.push(word);
    let object = {};
    fields.forEach((field, i) => object[headers[i]] = field);

    return object;
  });
};

class EventController {
  async store({ request, response, session }) {
    let { name, rules, start_date, end_date, amount_easy, amount_medium, amount_hard, amount_special } = request.all()

    start_date = moment(`${start_date} 00:00`, dateFormat)
    end_date = moment(`${end_date} 23:59`, dateFormat)

    if (!start_date.isValid()) {
      session.flash({ error: 'Data de início inválida' })
      session.flashAll()

      return response.redirect('back')
    } else if (!end_date.isValid()) {
      session.flash({ error: 'Data de fim inválida' })
      session.flashAll()

      return response.redirect('back')
    } else if (start_date.isAfter(end_date)) {
      session.flash({ error: 'A data de início deve ser antes da data de fim' })
      session.flashAll()

      return response.redirect('back')
    }

    const event = new Event();
    event.name = name;
    event.rules = rules;
    event.start_date = formatDate(start_date);
    event.end_date = formatDate(end_date);
    event.amount_easy = amount_easy;
    event.amount_medium = amount_medium;
    event.amount_hard = amount_hard;
    event.amount_special = amount_special;
    
    try {
      await event.save();
      
      const studentsFile = request.file('students', {})
      const fileName = String(Date.now());
      
      await studentsFile.move(Helpers.tmpPath('uploads'), {
        name: fileName,
        overwrite: true
      })
      
      const students = _parseCSV(fs.readFileSync(Helpers.tmpPath('uploads') + '/' + fileName, 'utf8'));
      const bulkInsert = students.map(student => ({
        event_id: event.id,
        name: student.Nome,
        school: student.Escola,
        shift: student.Turno_Introcomp == 'Matutino' ? 'MORNING' : student.Turno_Introcomp == 'Vespertino' ? 'VESPERTINE' : 'BOTH',
        cpf: student.Cpf,
        email: student.Email
      }))
      await User.createMany(bulkInsert)

      session.flash({ notification: 'Evento criado com sucesso' })
      return response.route('admin.menu')
    } catch (e) {
      console.log(e)

      return response.status(500)
    }
  }

  async list({ view }) {
    const events = await Event.query().where('end_date', '>', formatDate(moment())).fetch();

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