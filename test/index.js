var assert = require("assert");
var sinon = require("sinon");
var synchronizer = require("../");

var spy = sinon.spy();

function asyncFuncNeedsExclusiveAccessControl(message) {
  if (asyncFuncNeedsExclusiveAccessControl.LOCKED) {
    throw new Error("FATAL ERROR: THIS FUNCTION IS LOCKED!!");
  }
  asyncFuncNeedsExclusiveAccessControl.LOCKED = true;

  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      spy(message);

      asyncFuncNeedsExclusiveAccessControl.LOCKED = false;

      resolve(message);
    }, 10);
  });
}

describe("synchronizer", function() {
  beforeEach(function() {
    spy.reset();
    asyncFuncNeedsExclusiveAccessControl.LOCKED = false;
  });
  describe("create(object: any): function", function() {
    it("works", function() {
      var synchronized = synchronizer.create({ name: "alice" });

      synchronized(function(object) {
        return asyncFuncNeedsExclusiveAccessControl(object.name + "!!");
      }).then(function(res) {
        assert(res === "alice!!");
      });

      return synchronized(function(object) {
        return asyncFuncNeedsExclusiveAccessControl(object.name + "??");
      }).then(function(res) {
        assert(res === "alice??");
      }).then(function() {
        assert(spy.callCount === 2);
        assert(spy.args[0][0] === "alice!!");
        assert(spy.args[1][0] === "alice??");
        assert(asyncFuncNeedsExclusiveAccessControl.LOCKED === false);
      });
    });
  });
});
