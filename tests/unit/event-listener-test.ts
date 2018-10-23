import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { eventListener } from 'ember-lifeline-decorators';
import delay from 'delay';

module('@eventListener', function() {
  test('can decorate methods', async function(assert) {
    assert.expect(4);

    let runCount = 0;
    let runArg: MouseEvent;

    class TestObject extends EmberObject {
      @eventListener(window, 'click')
      doStuff(arg: MouseEvent) {
        runCount++;
        // eslint-disable-next-line typescript/no-use-before-define
        assert.equal(this, obj, 'context is correct');
        runArg = arg;
      }
    }

    const obj = new TestObject();

    assert.equal(runCount, 0, 'should not have run');

    document.body.click();

    await delay(10);

    assert.equal(runCount, 1, 'should have run');
    assert.ok(
      // eslint-disable-next-line typescript/no-non-null-assertion
      runArg! instanceof MouseEvent,
      'should pass the event to the hook'
    );
  });
});
