'use strict'

const moment = require('moment');

class ExamQuestionController {
    async update({ params, auth, request, response }) {
        const { answer } = request.all()
        const { id } = params

        if (!id) return response.status(400)

        const exam = await auth.user.exam().first()

        if (exam.status === 'FINISHED') return response.status(401);

        if (Number(answer) < 0 || Number(answer) > 5) return response.status(400)

        const schedule = (await exam.schedule().first()).toJSON();
        const startTime = moment(schedule.start_datettime, 'DD/MM/YYYY [às] HH:mm');
        const endTime = moment(schedule.end_datettime, 'DD/MM/YYYY [às] HH:mm');

        if (startTime.isBefore(moment()) && endTime.isAfter(moment())) return response.status(400)

        const updates = await exam.questions().pivotQuery().where({ question_id: id }).update({ answer })

        if (updates === 0) return response.status(400)
    }
}

module.exports = ExamQuestionController
