'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.on('menu').render('admin/menu').as('admin.menu')

    // Question endpoints
    Route.on('question').render('admin/create_question').as('admin.create_question')
    Route.post('question', 'QuestionController.store').as('questions.create')
    Route.get('questions', 'QuestionController.list').as('admin.list_quests')
    Route.delete('questions', 'QuestionController.delete').as('question.delete')
    Route.get('questions/:id', 'QuestionController.showEdit').as('question.edit')
    Route.put('questions/:id', 'QuestionController.edit').as('question.put')
    Route.post('questionsDownload', 'QuestionController.exportMetrics').as('metrics.download')
    Route.get('questionsDownload', 'QuestionController.metrics').as('questions.metrics')

    // Users endpoints
    Route.get('teacher', 'UserController.showTeacher').as('admin.create_teacher')
    Route.post('teacher', 'UserController.createTeacher').as('teacher.create')
    Route.get('users', 'UserController.show').as('admin.create_user')
    Route.post('users', 'UserController.createStudent').as('student.create')

    // ExamSchedule Endpoints
    Route.get('schedules', 'ExamScheduleController.list').as('admin.list_schedule')
    Route.get('schedule', 'ExamScheduleController.showCreate').as('admin.create_schedule')
    Route.post('schedule', 'ExamScheduleController.store').as('schedule.create')
    Route.delete('schedules', 'ExamScheduleController.delete').as('schedule.delete')
    Route.get('schedules/:id', 'ExamScheduleController.showEdit').as('schedule.showEdit')
    Route.put('schedules/:id', 'ExamScheduleController.edit').as('schedule.edit')

    // Events Endpoints
    Route.on('event').render('admin/create_event').as('admin.create_event')
    Route.get('events', 'EventController.list').as('admin.list_events')
    Route.post('events', 'EventController.store').as('event.create')
    Route.delete('events', 'EventController.delete').as('event.delete')

    // See ended exam
    Route.get('exams', 'ExamController.list').as('admin.exams')
    Route.get('exam/:id', 'ExamController.viewEnded').as('admin.exam')

    Route.get('grades', 'ExamController.grades').as('admin.grades')
    Route.post('grades', 'ExamController.exportGrades').as('grades.download')
}).prefix('admin').middleware(['isAdmin'])

Route.group(() => {
    Route.on('menu').render('teacher/menu').as('teacher.menu')
    Route.get('schedules', 'ExamScheduleController.list').as('teacher.list_schedule')
    Route.get('schedules/:id', 'ExamScheduleController.showEdit').as('teacher.schedule.showEdit')
    Route.put('schedules/:id', 'ExamScheduleController.edit').as('teacher.schedule.edit')

    Route.get('users', 'UserController.show').as('teacher.create_user')
    Route.post('users', 'UserController.createStudent').as('teacher.student.create')
}).prefix('teacher').middleware(['isTeacher'])

Route.get('admin', 'UserController.adminIndex').middleware('isGuest').as('admin.index')
Route.post('admin', 'UserController.adminLogin').middleware('isGuest').as('admin.login')
Route.post('/api/admin', 'UserController.adminApiLogin').middleware('isGuest').as('admin.login')

Route.get('teacher', 'UserController.teacherIndex').middleware('isGuest').as('teacher.index')
Route.post('teacher', 'UserController.teacherLogin').middleware('isGuest').as('teacher.login')

Route.get('/', 'UserController.index').as('student.index').middleware('isGuest')
Route.post('/login', 'UserController.login').middleware('isGuest').as('student.login')
Route.get('/logout', 'UserController.logout').middleware('auth').as('student.logout')

Route.get('/exam', 'ExamController.show').middleware('isStudent').as('exam.show')
Route.get('/waiting', 'ExamController.waitingStart').middleware('isStudent').as('exam.waiting')
Route.get('/finished', 'ExamController.finished').middleware('isStudent').as('exam.finished')

Route.get('/time', 'ExamController.getCurrentTime').as('exam.time')

Route.post('/examquestion/:id', 'ExamQuestionController.update').as('examquestion.update')
