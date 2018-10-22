import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { disposable } from 'ember-lifeline-decorators';

module('@disposable', function(hooks) {
  test('can decorate methods', function(assert) {
    assert.expect(3);

    let done = assert.async();
    let runCount = 0;

    class TestObject extends EmberObject {
      @disposable
      doStuff() {
        runCount++;
        assert.equal(this, obj, 'context is correct');
      }
    }

    const obj = new TestObject();

    assert.equal(runCount, 0, 'should not have run');

    obj.destroy();

    window.setTimeout(() => {
      assert.equal(runCount, 1, 'should have run');
      done();
    }, 10);
  });
});
