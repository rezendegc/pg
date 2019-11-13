'use strict'

class ExamQuestionController {
    async update({ params, auth, request, response }) {
        // TODO: VERIFICAR SEMPRE SE A PROVA DO USUÁRIO AINDA É VÁLIDA
        const { answer } = request.all()
        const { id } = params

        if (!id) return response.status(400)

        const exam = await auth.user.exam().first()

        if (Number(answer) < 0 || Number(answer) > 5) return response.status(400)

        const updates = await exam.questions().pivotQuery().where({ question_id: id }).update({ answer })

        if (updates === 0) return response.status(400)
    }
}

module.exports = ExamQuestionController
