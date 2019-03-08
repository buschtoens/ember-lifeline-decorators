import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { eventListener } from 'ember-lifeline-decorators';
import inRunLoop, { next } from 'dummy/tests/helpers/in-run-loop';

module('@eventListener', function(hooks) {
  inRunLoop(hooks);

  test('can decorate methods', async function(assert) {
    assert.expect(4);

    let runCount = 0;
    let runArg: MouseEvent;

    class TestObject extends EmberObject {
      @eventListener(window, 'click', { once: true })
      doStuff(arg: MouseEvent) {
        runCount++;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        assert.equal(this, obj, 'context is correct');
        runArg = arg;
      }
    }

    const obj = new TestObject();

    assert.equal(runCount, 0, 'should not have run');

    document.body.click();

    next();

    assert.equal(runCount, 1, 'should have run');
    assert.ok(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      runArg! instanceof MouseEvent,
      'should pass the event to the hook'
    );
  });
});
