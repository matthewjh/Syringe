var dts = require('dts-bundle');

module.exports = function() {
    dts.bundle({
        name: 'syringe.ts',
        main: 'built/src/index.d.ts',
        out: '../../dist/syringe.d.ts'
    });
}