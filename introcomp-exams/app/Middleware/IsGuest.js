'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class IsAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ response, auth }, next) {
    const logged = await auth.check()

    if (logged) {
      if (auth.user.role === 'ADMIN') {
        return response.route('admin.menu')
      } else if (auth.user.role === 'STUDENT') {
        return response.route('exam.show')
      }
    }

    await next()

  }
}

module.exports = IsAdmin
