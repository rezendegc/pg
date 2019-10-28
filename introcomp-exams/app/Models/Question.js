"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Question extends Model {
  exams() {
    return this.belongsToMany("App/Models/Exam").pivotTable("exam_questions").withPivot(['answer'])
  }
}

module.exports = Question;
