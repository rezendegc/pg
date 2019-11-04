'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ExamQuestion extends Model {
    static get table() {
        return 'exam_question'
    }
}

module.exports = ExamQuestion
