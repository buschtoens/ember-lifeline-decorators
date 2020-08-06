import { module, test } from 'qunit';

import EmberObject from '@ember/object';

import { eventListener } from 'ember-lifeline-decorators';

import inRunLoop, { next } from 'dummy/tests/helpers/in-run-loop';

module('@eventListener', function (hooks) {
  inRunLoop(hooks);

  test('can decorate methods', async function (assert) {
    assert.expect(4);

    let runCount = 0;
    let runArgument: MouseEvent;

    class TestObject extends EmberObject {
      @eventListener(window, 'click', { once: true })
      doStuff(argument: MouseEvent) {
        runCount++;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        assert.strictEqual(this, object, 'context is correct');
        runArgument = argument;
      }
    }

    const object = TestObject.create();

    assert.strictEqual(runCount, 0, 'should not have run');

    document.body.click();

    next();

    assert.strictEqual(runCount, 1, 'should have run');
    assert.ok(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      runArgument! instanceof MouseEvent,
      'should pass the event to the hook'
    );
  });
});
