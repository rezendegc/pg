'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class IsStudent {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ response, auth }, next) {
    try {
      await auth.check()

      if (auth.user.role !== 'STUDENT') {
        throw new Error('Only students may access this page')
      }
    } catch (error) {
      return response.status(401).send({ message: error.message })
    }

    await next()
  }
}

module.exports = IsStudent
