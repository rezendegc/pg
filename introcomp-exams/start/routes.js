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

Route.get('/', 'UserController.index').as('student.index').middleware('guest')
Route.get('/admin', 'UserController.adminIndex').middleware('guest').as('admin.index')
Route.post('/admin', 'UserController.adminLogin').middleware('guest').as('admin.login')
Route.post('/login', 'UserController.login').middleware('guest').as('student.login')
Route.get('/logout', 'UserController.logout').middleware('auth').as('student.logout')
Route.get('/exam', 'ExamController.show').middleware('auth').as('exam.show')
Route.on('/admin/menu').render('admin/menu').middleware('isAdmin').as('admin.menu')