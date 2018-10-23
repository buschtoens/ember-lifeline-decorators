import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { disposable } from 'ember-lifeline-decorators';
import delay from 'delay';

module('@disposable', function() {
  test('can decorate methods', async function(assert) {
    assert.expect(3);

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

    await delay(10);

    assert.equal(runCount, 1, 'should have run');
  });
});
