"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Event extends Model {
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
