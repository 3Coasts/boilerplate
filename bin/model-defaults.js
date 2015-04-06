exports.save = function (obj) {
  obj.updatedAt = new Date();
  if(!obj.createdAt){
    obj.createdAt = new Date();
  }
  return obj;
};

exports.slug = function () {
};