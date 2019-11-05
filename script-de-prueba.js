'use strict'

const i18n = require('./lib/i18nConfigure')()

const locale = 'es' // o 'en' y lo puedo usar

i18n.setLocale(locale)

console.log(i18n.__('Buscando'))
