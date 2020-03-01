"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ExamSchedule extends Model {
  static get dates() {
    return super.dates.concat(['start_datetime', 'end_datetime'])
  }

  static castDates (field, value) {
    if (field === 'start_datetime' || field === 'end_datetime') {
      return value.format('DD/MM/YYYY [às] HH:mm')
    }
    return super.formatDates(field, value)
  }

  exams() {
    return this.hasMany("App/Models/Exam");
  }

  event() {
    return this.belongsTo("App/Models/Event");
  }
}

module.exports = ExamSchedule;
