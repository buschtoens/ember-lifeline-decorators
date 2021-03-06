/* eslint-disable qunit/no-commented-tests */
import { module, test } from 'qunit';

import EmberObject from '@ember/object';

import { schedule } from 'ember-lifeline-decorators';

import inRunLoop, { next } from 'dummy/tests/helpers/in-run-loop';

module('@schedule', function (hooks) {
  inRunLoop(hooks);

  test('can decorate methods', async function (assert) {
    assert.expect(4);

    let runCount = 0;
    let runArgument: string;

    class TestObject extends EmberObject {
      @schedule('actions')
      doStuff(argument: string) {
        runCount++;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        assert.strictEqual(this, object, 'context is correct');
        runArgument = argument;
      }
    }

    const object = TestObject.create();

    object.doStuff('arg1');

    assert.strictEqual(runCount, 0, 'should not have run');

    next();

    assert.strictEqual(runCount, 1, 'should have run');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    assert.strictEqual(
      runArgument!,
      'arg1',
      'should run the task with the arg'
    );
  });

  // test('debounceTask can be canceled', function(assert) {
  //   let done = assert.async();
  //   assert.expect(2);

  //   let runCount = 0;
  //   this.obj = this.getComponent({
  //     doStuff() {
  //       runCount++;
  //     }
  //   });

  //   debounceTask(this.obj, 'doStuff', 5);
  //   debounceTask(this.obj, 'doStuff', 5);
  //   cancelDebounce(this.obj, 'doStuff');

  //   assert.equal(runCount, 0, 'should not have run');

  //   window.setTimeout(() => {
  //     assert.equal(runCount, 0, 'should not have run');
  //     done();
  //   }, 10);
  // });

  // test('cancelDebounce does not throw an error if the debounced task was never run', function(assert) {
  //   assert.expect(1);

  //   this.obj = this.getComponent({
  //     doStuff() {}
  //   });

  //   cancelDebounce(this.obj, 'doStuff');

  //   assert.ok(true, 'should not have thrown an error');
  // });

  // test('cancelDebounce does not throw an error if the debounced task is no longer pending', function(assert) {
  //   let done = assert.async();
  //   assert.expect(1);

  //   this.obj = this.getComponent({
  //     doStuff() {}
  //   });

  //   debounceTask(this.obj, 'doStuff', 5);

  //   window.setTimeout(() => {
  //     cancelDebounce(this.obj, 'doStuff');
  //     assert.ok(true, 'should not have thrown an error');
  //     done();
  //   }, 10);
  // });
});
