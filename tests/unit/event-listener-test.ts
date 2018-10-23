import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { eventListener } from 'ember-lifeline-decorators';

module('@eventListener', function() {
  test('can decorate methods', function(assert) {
    assert.expect(4);

    let done = assert.async();
    let runCount = 0;
    let runArg: MouseEvent;

    class TestObject extends EmberObject {
      @eventListener(window, 'click')
      doStuff(arg: MouseEvent) {
        runCount++;
        assert.equal(this, obj, 'context is correct');
        runArg = arg;
      }
    }

    const obj = new TestObject();

    assert.equal(runCount, 0, 'should not have run');

    document.body.click();

    window.setTimeout(() => {
      assert.equal(runCount, 1, 'should have run');
      assert.ok(runArg instanceof MouseEvent, 'should pass the event to the hook');
      done();
    }, 10);
  });
});
