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

    try {
      await auth.check()

      if (auth.user.role !== 'TEACHER') {
        throw new Error('Need teacher privileges')
      }
    } catch (error) {
      return response.status(401).route('teacher.index')
    }

    await next()
  }
}

module.exports = IsAdmin
