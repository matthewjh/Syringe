var babel = require('babel');
var glob = require('glob');
var vm = require('vm');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = function generate() {
  var generatorPaths = glob.sync('src/**/*.gen.*');

  generatorPaths.forEach(function (p) {
    var outPath = path.join('built', p.replace('.gen', ''));
    var outPathDir = path.parse(outPath).dir;
    var transformed = babel.transformFileSync(p);
    var generationCode = transformed.code;
    var context = {
      exports: {},
      module: {
        exports: {}
      }
    };

    vm.runInNewContext(generationCode, context);

    var generatedSource = 'module.exports = ' + context.exports.default.trim();
    
    mkdirp.sync(outPathDir);
    fs.writeFileSync(outPath, generatedSource);
  });
};
