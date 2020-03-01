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
    Route.on('teacher').render('admin/create_teacher').as('admin.create_teacher')
    Route.on('remove_question').render('admin/remove_question').as('admin.remove_question')
    Route.on('question').render('admin/create_question').as('admin.create_question')
    
    // Users endpoints
    Route.get('users', 'UserController.show').as('admin.create_user')
    
    // ExamSchedule Endpoints
    Route.get('schedules', 'ExamScheduleController.list').as('admin.list_schedule')
    Route.get('schedule', 'ExamScheduleController.showCreate').as('admin.create_schedule')
    Route.post('schedule', 'ExamScheduleController.store').as('schedule.create')
    
    // Events Endpoints
    Route.on('event').render('admin/create_event').as('admin.create_event')
    Route.get('events', 'EventController.list').as('admin.list_events')
    Route.post('events', 'EventController.store').as('event.create')

}).prefix('admin').middleware(['isAdmin'])

Route.get('/admin', 'UserController.adminIndex').middleware('guest').as('admin.index')
Route.post('/admin', 'UserController.adminLogin').middleware('guest').as('admin.login')

Route.get('/', 'UserController.index').as('student.index').middleware('guest')
Route.post('/login', 'UserController.login').middleware('guest').as('student.login')
Route.get('/logout', 'UserController.logout').middleware('auth').as('student.logout')

Route.get('/exam', 'ExamController.show').middleware('isStudent').as('exam.show')
Route.get('/waiting', 'ExamController.waitingStart').middleware('isStudent').as('exam.waiting')
Route.get('/finished', 'ExamController.finished').middleware('isStudent').as('exam.finished')

Route.post('/examquestion/:id', 'ExamQuestionController.update').as('examquestion.update')