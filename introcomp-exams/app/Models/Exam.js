"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Exam extends Model {
  user() {
    return this.belongsTo("App/Models/User");
  }

  schedule() {
    return this.belongsTo("App/Models/ExamSchedule");
  }

  event() {
    return this.belongsTo("App/Models/Event");
  }

  questions() {
    return this.belongsToMany("App/Models/Question")
      .pivotModel("App/Models/ExamQuestion")
      .withPivot(['answer'])
  }
}

module.exports = Exam;
