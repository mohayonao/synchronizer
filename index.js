function create(object) {
  var wait = Promise.resolve();

  function synchronized(func) {
    function next() {
      return func(object);
    }
    return (wait = wait.then(next, next));
  }

  return synchronized;
}

module.exports = {
  create: create,
};
