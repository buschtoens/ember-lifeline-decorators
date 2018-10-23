import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { schedule } from 'ember-lifeline-decorators';

module('@schedule', function() {
  test('can decorate methods', function(assert) {
    assert.expect(4);

    let done = assert.async();
    let runCount = 0;
    let runArg: string;

    class TestObject extends EmberObject {
      @schedule('sync')
      doStuff(arg: string) {
        runCount++;
        assert.equal(this, obj, 'context is correct');
        runArg = arg;
      }
    }

    const obj = new TestObject();

    obj.doStuff('arg1');

    assert.equal(runCount, 0, 'should not have run');

    window.setTimeout(() => {
      assert.equal(runCount, 1, 'should have run');
      assert.equal(runArg, 'arg1', 'should run the task with the arg');
      done();
    }, 10);
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
