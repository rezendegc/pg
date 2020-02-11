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

Route.get('/admin', 'UserController.adminIndex').middleware('guest').as('admin.index')
Route.post('/admin', 'UserController.adminLogin').middleware('guest').as('admin.login')
Route.on('/admin/menu').render('admin/menu').middleware('isAdmin').as('admin.menu')
Route.on('/admin/users').render('admin/create_user').middleware('isAdmin').as('admin.create_user')
Route.on('/admin/teacher').render('admin/create_teacher').middleware('isAdmin').as('admin.create_teacher')
Route.on('/admin/schedule').render('admin/create_schedule').middleware('isAdmin').as('admin.create_schedule')
Route.on('/admin/schedules').render('admin/list_schedule').middleware('isAdmin').as('admin.list_schedule')
Route.on('/admin/remove_question').render('admin/remove_question').middleware('isAdmin').as('admin.remove_question')
Route.on('/admin/question').render('admin/create_question').middleware('isAdmin').as('admin.create_question')

Route.get('/', 'UserController.index').as('student.index').middleware('guest')
Route.post('/login', 'UserController.login').middleware('guest').as('student.login')
Route.get('/logout', 'UserController.logout').middleware('auth').as('student.logout')

Route.get('/exam', 'ExamController.show').middleware('isStudent').as('exam.show')
Route.get('/waiting', 'ExamController.waitingStart').middleware('isStudent').as('exam.waiting')
Route.get('/finished', 'ExamController.finished').middleware('isStudent').as('exam.finished')

Route.post('/examquestion/:id', 'ExamQuestionController.update').as('examquestion.update')