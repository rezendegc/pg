'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const randomTime = faker => {

    return faker.hour({ twentyfour: true }) + ":" + faker.minute()
}

Factory.blueprint('App/Models/ExamSchedule', (faker, i, data) => {
    return {
        start_datetime: (data && data.start) || faker.date({ year: 2019 }),
        end_datetime: (data && data.end) || faker.date({ year: 2019 }),
        register_time: (data && data.time) || randomTime(faker)
    }
})

Factory.blueprint('App/Models/Event', (faker, i, data) => {
    return {
        start_date: (data && data.start) || faker.date({ year: 2019, month: 1 }),
        end_date: (data && data.end) || faker.date({ year: 2040, month: 5 }),
        name: faker.sentence(),
        rules: faker.paragraph({ sentences: 4 })
    }
})

Factory.blueprint('App/Models/Exam', (faker) => {
    return {
        grade: faker.integer({ min: 0, max: 15 })
    }
})

Factory.blueprint('App/Models/User', (faker, i, data) => {
    return {
        email: (data && data.email) || faker.email(),
        password: data.password,
        school: faker.word(),
        cpf: faker.cpf(),
        name: faker.name(),
        role: (data && data.role) || 'STUDENT',
        shift: (data && data.shift) || 'MORNING',
        event_id: data.event_id
    }
})

Factory.blueprint('App/Models/Question', (faker, i, data) => {
    return {
        summary: faker.sentence(),
        difficulty: (data && data.difficulty) || faker.integer({ min: 1, max: 4 }),
        is_image: (data && data.isImage) || false,
        wording: faker.paragraph(),
        correct_answer: (data && data.correctAnswer) || faker.integer({ min: 1, max: 5 }),
        answer_1: (data && data.answer1) || faker.sentence(),
        answer_2: (data && data.answer2) || faker.sentence(),
        answer_3: (data && data.answer3) || faker.sentence(),
        answer_4: (data && data.answer4) || faker.sentence(),
        answer_5: (data && data.answer5) || faker.sentence(),
    }
})