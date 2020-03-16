'use strict'

/** @type {typeof import('../../Models/Question')} */
const Question = use('App/Models/Question')
const Helpers = use('Helpers')

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
}

module.exports = QuestionController
