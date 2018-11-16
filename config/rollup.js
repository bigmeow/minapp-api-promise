var pkg = require('../package.json')

// 兼容 minapp-api-promise 和 @bigmeow/minapp-api-promise
var name = pkg.name.split('/').pop()
var version = pkg.version

var banner =
`/*!
 * minapp-api-promise ${version} (https://github.com/bigmeow/minapp-api-promise)
 * API https://github.com/bigmeow/minapp-api-promise/blob/master/doc/api.md
 * Copyright 2018-${(new Date()).getFullYear()} bigmeow. All Rights Reserved
 * Licensed under MIT (https://github.com/bigmeow/minapp-api-promise/blob/master/LICENSE)
 */
`

exports.name = name
exports.banner = banner
