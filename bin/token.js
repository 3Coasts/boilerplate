module.exports = function (length, chars) {
  var tokenLength = length || 15;
  var rangeOfCharacters = chars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  var token = '';
  var iterator = 0;

  while (iterator < tokenLength) {
    token += rangeOfCharacters.charAt(Math.floor(Math.random() * rangeOfCharacters.length));
    iterator++;
  }
  return token;
};