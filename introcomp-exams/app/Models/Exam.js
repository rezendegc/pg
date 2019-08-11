"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Exam extends Model {
  users() {
    return this.hasMany("App/Models/User");
  }

  schedule() {
    return this.belongsTo("App/Models/ExamSchedule");
  }

  questions() {
    return this.belongsToMany("App/Models/Question").pivotTable(
      "exam_questions"
    );
  }
}

module.exports = Exam;
