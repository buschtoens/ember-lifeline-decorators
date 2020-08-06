# ember-lifeline-decorators

[![Build Status](https://travis-ci.org/buschtoens/ember-lifeline-decorators.svg)](https://travis-ci.org/buschtoens/ember-lifeline-decorators)
[![npm version](https://badge.fury.io/js/ember-lifeline-decorators.svg)](http://badge.fury.io/js/ember-lifeline-decorators)
[![Download Total](https://img.shields.io/npm/dt/ember-lifeline-decorators.svg)](http://badge.fury.io/js/ember-lifeline-decorators)
[![Ember Observer Score](https://emberobserver.com/badges/ember-lifeline-decorators.svg)](https://emberobserver.com/addons/ember-lifeline-decorators)
[![Ember Versions](https://img.shields.io/badge/Ember.js%20Versions-%5E2.12%20%7C%7C%20%5E3.0-brightgreen.svg)](https://travis-ci.org/buschtoens/ember-lifeline-decorators)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)  
[![Dependabot enabled](https://img.shields.io/badge/dependabot-enabled-blue.svg?logo=dependabot)](https://dependabot.com/)
[![dependencies](https://img.shields.io/david/buschtoens/ember-lifeline-decorators.svg)](https://david-dm.org/buschtoens/ember-lifeline-decorators)
[![devDependencies](https://img.shields.io/david/dev/buschtoens/ember-lifeline-decorators.svg)](https://david-dm.org/buschtoens/ember-lifeline-decorators)

This Ember addon gives you
[decorators](https://github.com/tc39/proposal-decorators) for elegantly using
[ember-lifeline][ember-lifeline] with ES6 classes.

[ember-lifeline]: https://github.com/ember-lifeline/ember-lifeline

## Installation

Install as any other addon. You will also need [ember-lifeline][ember-lifeline]
itself:

```
ember install ember-lifeline-decorators ember-lifeline
```

## Usage

You don't need to register `runDisposables(this)` in the `willDestroy` hook. The
decorators do this for you.

### Available decorators

| Decorator                              | ember-lifeline                             | Description                                            |
|----------------------------------------|--------------------------------------------|--------------------------------------------------------|
| **[`@later`](#later)**                 | [`runTask`][runtask]                       | Delay the execution of this method                     |
| **[`@schedule`](#schedule)**           | [`scheduleTask`][scheduletask]             | Schedule this method on a run loop queue               |
| **[`@debounce`](#debounce)**           | [`debounceTask`][debouncetask]             | Debounce this method                                   |
| **[`@throttle`](#throttle)**           | [`throttleTask`][throttletask]             | Throttle this method                                   |
| **[`@disposable`](#disposable)**       | [`registerDisposable`][registerdisposable] | Automatically execute this method during `willDestroy` |
| **[`@eventListener`](#eventListener)** | [`addEventListener`][addeventlistener]     | Execute this method when a DOM event is fired          |

[runtask]: https://github.com/ember-lifeline/ember-lifeline#runtask
[scheduletask]: https://github.com/ember-lifeline/ember-lifeline#scheduletask
[debouncetask]: https://github.com/ember-lifeline/ember-lifeline#debouncetask
[throttletask]: https://github.com/ember-lifeline/ember-lifeline#throttletask
[registerdisposable]: https://github.com/ember-lifeline/ember-lifeline#registerdisposable
[addeventlistener]: https://github.com/ember-lifeline/ember-lifeline#addeventlistener

#### `@later`

- **`timeout`**: _`number`_ — delay in milliseconds

[`runTask`][runtask] / [`import { later } from '@ember/runloop';`](https://www.emberjs.com/api/ember/3.5/functions/@ember%2Frunloop/later)

Delays the execution of the decorator by `timeout` milliseconds.

```js
import Component from '@ember/component';
import { later } from 'ember-lifeline-decorators';

export default class ExampleComponent extends Component {
  @later(500)
  function callMeMaybe() {
    // ...
  }

  // and then elsewhere
  hereIsMyNumber() {
    this.callMeMaybe();
  }
}
```

#### `@schedule`

- **`queue`**: _`RunLoopQueue`_ — the queue to put the method in
  - `sync`
  - `actions`
  - `routerTransitions`
  - `render`
  - `destroy`

[`scheduleTask`][scheduletask] / [`import { schedule } from '@ember/runloop';`](https://www.emberjs.com/api/ember/3.5/functions/@ember%2Frunloop/schedule)

When the method is called, it is scheduled to be run in the specified
[run loop queue](https://guides.emberjs.com/release/applications/run-loop/).

```js
import Component from '@ember/component';
import { later } from 'ember-lifeline-decorators';

export default class ExampleComponent extends Component {
  @schedule('render')
  function callMeMaybe() {
    // ...
  }

  // and then elsewhere
  hereIsMyNumber() {
    this.callMeMaybe();
  }
}
```

#### `@debounce`

- **`wait`**: _`number`_ — delay in milliseconds
- **`immediate = false`**: _`boolean`_ — trigger the function on the leading instead of the trailing edge of the wait interval

[`debounceTask`][debouncetask] / [`import { debounce } from '@ember/runloop';`](https://www.emberjs.com/api/ember/3.5/functions/@ember%2Frunloop/debounce)

Delay calling the target method until the debounce period has elapsed with no
additional debounce calls. If the method is called again before the specified
time has elapsed, the timer is reset and the entire period must pass again
before the target method is called.

```js
import Component from '@ember/component';
import { debounce } from 'ember-lifeline-decorators';

export default class ExampleComponent extends Component {
  @debounce(500)
  function callMeMaybe() {
    // ...
  }

  // and then elsewhere
  hereIsMyNumber() {
    this.callMeMaybe();
  }
}
```

#### `@throttle`

- **`spacing`**: _`number`_ — Number of milliseconds to space out executions
- **`immediate = true`**: _`boolean`_ — trigger the function on the leading instead of the trailing edge of the wait interval

[`throttleTask`][throttletask] / [`import { throttle } from '@ember/runloop';`](https://www.emberjs.com/api/ember/3.5/functions/@ember%2Frunloop/throttle)

Ensure that the target method is never called more frequently than the specified
spacing period.

```js
import Component from '@ember/component';
import { throttle } from 'ember-lifeline-decorators';

export default class ExampleComponent extends Component {
  @throttle(500)
  function callMeMaybe() {
    // ...
  }

  // and then elsewhere
  hereIsMyNumber() {
    this.callMeMaybe();
  }
}
```

#### `@eventListener`

- **`target`**:
  - _`EventTarget`_ — target, such as `window` or `HTMLElement`, to register the listener on
  - _`(this: EmberObject, ctx: EmberObject) => EventTarget`_ — a callback that is called with the context bound to and the first parameter as the object the decorator is used on
- **`eventName`**: _`string`_ — the event to listen for
- **`options?`**: _`object`_ — optional options to pass to `addEventListener`

[`addEventListener`][addeventlistener] / [`EventTarget.addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

> ⚠️👉 In almost all scenarios it is much more sensible to use
> [`ember-on-modifier`][ember-on-modifier].

[ember-on-modifier]: https://github.com/buschtoens/ember-on-modifier#readme

Automatically calls this method whenever the given event is fired on `target`.

```js
import Component from '@ember/component';
import { eventListener } from 'ember-lifeline-decorators';

export default class ExampleComponent extends Component {
  @eventListener(window, 'scroll', { passive: true })
  function onScroll(event) {
    // ...
  }
}
```

By passing a callback function as the first parameter, you can query the class
instance the decorator is used on for information. For instance, you can access
the `element` property of a `Component`:

```js
import Component from '@ember/component';
import { eventListener } from 'ember-lifeline-decorators';

export default class ExampleComponent extends Component {
  @eventListener(t => t.element, 'scroll', { passive: true })
  function onScroll(event) {
    // ...
  }
}
```

If the `@eventListener` is used on a class that implements the
`didInsertElement` hook, like the good ol' Ember `Component` or
[`sparkles-component`](https://github.com/rwjblue/sparkles-component), the
callback will be executed during the `didInsertElement` hook. For all other
subclasses of `EmberObject` the callback will be executed during `init`.
