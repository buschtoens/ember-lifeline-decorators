import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { disposable } from 'ember-lifeline-decorators';
import inRunLoop, { next } from 'dummy/tests/helpers/in-run-loop';

module('@disposable', function(hooks) {
  inRunLoop(hooks);

  test('can decorate methods', async function(assert) {
    assert.expect(3);

    let runCount = 0;

    class TestObject extends EmberObject {
      @disposable
      doStuff() {
        runCount++;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        assert.equal(this, obj, 'context is correct');
      }
    }

    const obj = TestObject.create();

    assert.equal(runCount, 0, 'should not have run');

    obj.destroy();

    next();

    assert.equal(runCount, 1, 'should have run');
  });
});
