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
        start_date: (data && data.start) || faker.date({ year: 2019, month: 6 }),
        end_date: (data && data.end) || faker.date({ year: 2019, month: 10 }),
        name: faker.sentence()
    }
})

Factory.blueprint('App/Models/Exam', (faker) => {
    return {
        grade: faker.integer({ min: 0, max: 15 })
    }
})

Factory.blueprint('App/Models/User', (faker, i, data) => {
    return {
        email: faker.email(),
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
        summary: faker.paragraph(),
        difficulty: faker.integer({ min: 1, max: 3 }),
        is_image: (data[i] && data[i].isImage) || faker.bool(),
        wording: faker.paragraph(),
        correct_answer: (data[i] && data[i].correctAnswer) || faker.integer({ min: 1, max: 5 }),
        answer_1: data[i].answer1 || faker.sentence(),
        answer_2: data[i].answer2 || faker.sentence(),
        answer_3: data[i].answer3 || faker.sentence(),
        answer_4: data[i].answer4 || faker.sentence(),
        answer_5: data[i].answer5 || faker.sentence(),
    }
})