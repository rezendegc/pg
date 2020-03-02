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
}

module.exports = QuestionController
