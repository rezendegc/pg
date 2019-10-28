
'use strict'

const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
    const View = use('View')

    const moment = use('moment')

    View.global('formatDate', (value, pattern) => {
        return moment(value).format(pattern)
    })
})