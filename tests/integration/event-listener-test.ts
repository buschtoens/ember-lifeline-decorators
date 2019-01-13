import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { eventListener } from 'ember-lifeline-decorators';
import Component from '@ember/component';

module('@eventListener', function(hooks) {
  setupRenderingTest(hooks);

  test('it can be used on a component', async function(assert) {
    assert.expect(1);

    class TestComponent extends Component {
      @eventListener(window, 'click', { once: true })
      foo(event: MouseEvent) {
        assert.ok(event instanceof MouseEvent);
      }
    }

    this.owner.register('component:test-component', TestComponent);

    await render(hbs`{{test-component id='test-component'}}`);
    // eslint-disable-next-line typescript/no-non-null-assertion
    await click(this.element.querySelector('#test-component')!);
  });

  test('it accepts `this.element` as target', async function(assert) {
    assert.expect(1);

    class TestComponent extends Component {
      @eventListener(t => t.element, 'click', { once: true })
      foo(event: MouseEvent) {
        assert.ok(event instanceof MouseEvent);
      }
    }

    this.owner.register('component:test-component', TestComponent);

    await render(hbs`{{test-component id='test-component'}}`);
    // eslint-disable-next-line typescript/no-non-null-assertion
    await click(this.element.querySelector('#test-component')!);
  });

  test('it calls the callback after `didInsertElement`', async function(assert) {
    assert.expect(1);

    let didCall = false;

    class TestComponent extends Component {
      didInsertElement() {
        super.didInsertElement();

        assert.notOk(
          didCall,
          'callback was not called before the body of `didInsertElement`'
        );
      }
      @eventListener(
        t => {
          didCall = true;
          return t.element;
        },
        'click',
        {
          once: true
        }
      )
      foo(event: MouseEvent) {
        assert.ok(event instanceof MouseEvent);
      }
    }

    this.owner.register('component:test-component', TestComponent);

    await render(hbs`{{test-component id='test-component'}}`);
  });
});
