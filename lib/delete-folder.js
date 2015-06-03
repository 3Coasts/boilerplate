var fs = require('fs');

module.exports = function deleteFolder(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file) {
      var curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory())
        deleteFolder(curPath);
      else
        fs.unlinkSync(curPath);
    });
    fs.rmdirSync(path);
  }
};