import { module, test } from 'qunit';

import EmberObject from '@ember/object';

import { destructor } from 'ember-lifeline-decorators';

import inRunLoop, { next } from 'dummy/tests/helpers/in-run-loop';

module('@destructor', function (hooks) {
  inRunLoop(hooks);

  test('can decorate methods', async function (assert) {
    assert.expect(3);

    let runCount = 0;

    class TestObject extends EmberObject {
      @destructor
      doStuff() {
        runCount++;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        assert.strictEqual(this, object, 'context is correct');
      }
    }

    const object = TestObject.create();

    assert.strictEqual(runCount, 0, 'should not have run');

    object.destroy();

    next();

    assert.strictEqual(runCount, 1, 'should have run');
  });
});
