var fs = require('fs');
var semver = require('semver');
var bowerFilesDir = './bowerfiles/';
var bowerFiles = fs.readdirSync(bowerFilesDir);
var bowerDeps = [];

bowerFiles.forEach(function(file){
  var bd = require(bowerFilesDir + file);
  bd.mergeName = bd.name || file;
  bowerDeps.push(bd);
});

function mergeBower(bowerDeps, known, exact, conflict) {
  bowerDeps.forEach(function (bd, i) {
    var source = bd.dependencies;
    for (var pkg in source) {
      if (typeof known[pkg] !== 'undefined') {
        if (source[pkg] == known[pkg]) {
          exact[pkg] = source[pkg];
        } else {
          conflict[bd.mergeName] = conflict[bd.mergeName]||{};
          conflict[bowerDeps[i-1].mergeName] = conflict[bowerDeps[i-1].mergeName] || {};
          conflict[bd.mergeName][pkg] = source[pkg];
          conflict[bowerDeps[i-1].mergeName][pkg] = known[pkg];
        }
      } else {
        known[pkg] = known[pkg] || source[pkg];
      }
    }
  });
  //bowerFiles.forEach(function (source) {
  //  for (var pkg in known) {
  //    if (typeof source[pkg] === 'undefined') {
  //      if (source[pkg] == known[pkg]) {
  //        console.log(source[pkg], known[pkg]);
  //        exact[pkg] = source[pkg];
  //      } else {
  //        conflict[pkg] = [known[pkg], source[pkg]];
  //      }
  //    } else {
  //      known[pkg] = known[pkg] || source[pkg];
  //    }
  //  }
  //});


  return {'known': known, 'exact': exact, 'conflict': conflict};
}
var known = {}, conflict = {}, exact = {};

console.log(JSON.stringify(mergeBower(bowerDeps, known, exact, conflict), null, 2));

