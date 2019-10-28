
'use strict'

const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
    const View = use('View')

    const moment = use('moment')
    View.global('formatDate', (value, pattern) => {
        return moment(value).format(pattern)
    })

    View.global('countdown', (schedule) => {
        const start = moment(schedule.start_datetime)
        const registerTime = schedule.register_time.split(':')
        start.add(registerTime[0], 'h')
        start.add(registerTime[1], 'm')
        start.add(registerTime[2], 's')

        return console.log("hey!")

        return start.diff(moment())

        // return start.diff(moment())
    })
})