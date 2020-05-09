"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const moment = require('moment');

class Event extends Model {
  static get dates() {
    return super.dates.concat(['start_date', 'end_date'])
  }

  static castDates (field, value) {
    if (field === 'start_date' || field === 'end_date') {
      return moment(value).format('DD/MM/YYYY')
    }
    return super.formatDates(field, value)
  }

  users() {
    return this.hasMany("App/Models/User");
  }

  exams() {
    return this.hasMany("App/Models/Exam");
  }

  exam_schedules() {
    return this.hasMany("App/Models/ExamSchedule");
  }
}

module.exports = Event;
