module.exports = function (password, cb) {

  // be at least eight alphanumeric characters lon
  if(password.length < 8) return "LENGTH8";

  //contain digits or punctuation characters as well as letters (e.g., [0-9]~'!@#$%()_-'{.})
  var re = /[0-9\-!~'@#$%\(\)_{}\.]/
  if(!re.test(password)) return "SPECIAL_CHARS";

  //contain both upper and lower case characters (e.g., a-z, A-Z)
  var upper = /[A-Z]/
  if(!upper.test(password)) return "UPPER";

  var lower = /[a-z]/
  if(!lower.test(password)) return "LOWER";

  return true;

};