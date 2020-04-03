'use strict'

/** @type {typeof import('../../Models/Question')} */
const Question = use('App/Models/Question')
/** @type {typeof import('../../Models/Event')} */
const Event = use('App/Models/Event');
const Helpers = use('Helpers')
const Drive = use('Drive')
const moment = require('moment');

class QuestionController {
  async store({ request, response, session }) {
    const requestFields = request.all()
    const { resumo, enunciado, tipo_alternativa, dificuldade } = requestFields
    
    let imageNames = []
    if (tipo_alternativa == 'image') {
      const optionImages = request.file('imagem_alt', {
        types: ['image'],
        size: '1mb'
      })

      console.log(optionImages)

      let count = 0
      await optionImages.moveAll(Helpers.publicPath('uploads'), file => {
        count++
        const name = `${new Date().getTime()}${count}.${file.subtype}`
        imageNames.push(name)
        return { name }
      })

      if (!optionImages.movedAll()) {
        const movedFiles = optionImages.movedList()

        await Promise.all(
          movedFiles.map(file => {
            return removeFile(path.join(file._location, file.fileName))
          })
        )

        return optionImages.errors()
      }
    }

    try {
      await Question.create({
        summary: resumo,
        difficulty: dificuldade,
        is_image: tipo_alternativa === "text" ? false : true,
        wording: enunciado,
        correct_answer: 1,
        answer_1: tipo_alternativa === "text" ? requestFields.alt[0] : imageNames[0],
        answer_2: tipo_alternativa === "text" ? requestFields.alt[1] : imageNames[1],
        answer_3: tipo_alternativa === "text" ? requestFields.alt[2] : imageNames[2],
        answer_4: tipo_alternativa === "text" ? requestFields.alt[3] : imageNames[3],
        answer_5: tipo_alternativa === "text" ? requestFields.alt[4] : imageNames[4],
      })
      session.flash({ notification: 'Questão criada com sucesso' })
  
      return response.route('admin.menu')
    } catch (e) {
      console.log(e)

      return response.status(500)
    }
  }

  async list({ view }) {
    const questions = await Question.query().where({ deleted: false }).fetch();

    return view.render('admin/remove_question', { questions: questions && questions.toJSON() })
  }

  async delete({ request, response, session }) {
    const { questions } = request.all();
    if (!questions) return response.route('admin.menu')

    await Question.query().whereIn('id', questions).update({ deleted: true })
    
    session.flash({ notification: 'Questões apagadas com sucesso' })
  
    return response.route('admin.menu')
  }

  async showEdit({ view, params }) {
    const { id } = params;
    const question = await Question.find(id);

    return view.render('admin/edit_question', { question: question && question.toJSON() })
  }

  async edit({ request, response, params, session }) {
    const { id } = params;
    const { resumo, enunciado, alt, dificuldade } = request.all();

    const question = await Question.find(id);

    question.merge({
      summary: resumo,
      wording: enunciado,
      difficulty: dificuldade,
      answer_1: alt[0],
      answer_2: alt[1],
      answer_3: alt[2],
      answer_4: alt[3],
      answer_5: alt[4],
    })

    await question.save();

    session.flash({ notification: 'Questão atualizada com sucesso' })
  
    return response.route('admin.menu')
  }

  async exportMetrics({ response, request }) {
    const { eventId: id } = request.all();

    const questionsFetch = await Question.query().with('exams', builder => {
      builder.with('event');
    }).fetch();
    const questions = questionsFetch.toJSON();
    
    const fileName = 'Métricas ' + moment().format('YYYY-MM-DD HH:mm:ss') + '.csv';
    const headers = 'Resumo,Dificuldade,Total de usos,Acertos,Erros,Nulas,%Acertos,%Erros,%Nulas\n';
    const body = questions.map(e => {
      const length = e.exams.filter(el=> id =='all' || el.event.id == id).length;
      if (!length) return `${e.summary},${e.difficulty},0,0,0,0,0,0,0\n`;
      let rights = 0;
      let wrongs = 0;
      let nulls = 0;

      e.exams.forEach(exam => {
        if (id != 'all' && exam.event.id != id) return;
        if (exam.pivot.answer == e.correct_answer) rights++;
        else if (!exam.pivot.answer) nulls++;
        else wrongs++;
      });

      return `${e.summary},${e.difficulty},${length},${rights},${wrongs},${nulls},${rights/length*100}%,${wrongs/length*100}%,${nulls/length*100}%\n`;
    });
    
    await Drive.put(fileName, Buffer.from(headers+body.join('')))
    return response.attachment(
      Helpers.tmpPath(fileName)
    )
  }

  async metrics({ view }) {
    const events = await Event.query().fetch()

    return view.render('admin/metrics', { events: events.toJSON() })
  }
}

module.exports = QuestionController
