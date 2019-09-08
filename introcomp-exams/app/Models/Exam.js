"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Exam extends Model {
  users() {
    return this.belongsTo("App/Models/User");
  }

  schedule() {
    return this.belongsTo("App/Models/ExamSchedule");
  }

  event() {
    return this.belongsTo("App/Models/Event");
  }

  questions() {
    return this.belongsToMany("App/Models/Question").pivotTable(
      "exam_questions"
    );
  }
}

module.exports = Exam;
