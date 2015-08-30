var dts = require('dts-bundle');
var path = require('path');

module.exports = function(destFolder) {
    dts.bundle({
        name: 'syringe.ts',
        main: 'built/src/index.d.ts',
        out: path.join(destFolder, 'syringe-inner.d.ts'),
    });
};