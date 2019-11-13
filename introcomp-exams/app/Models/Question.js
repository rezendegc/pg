"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Question extends Model {
  static get hidden () {
    return ['correct_answer']
  }

  exams() {
    return this.belongsToMany("App/Models/Exam").pivotModel("App/Models/ExamQuestion").withPivot(['answer'])
  }
}

module.exports = Question;
