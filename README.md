# ember-lifeline-decorators

[![Build Status](https://travis-ci.org/buschtoens/ember-lifeline-decorators.svg)](https://travis-ci.org/buschtoens/ember-lifeline-decorators)
[![npm version](https://badge.fury.io/js/ember-lifeline-decorators.svg)](http://badge.fury.io/js/ember-lifeline-decorators)
[![Download Total](https://img.shields.io/npm/dt/ember-lifeline-decorators.svg)](http://badge.fury.io/js/ember-lifeline-decorators)
[![Ember Observer Score](https://emberobserver.com/badges/ember-lifeline-decorators.svg)](https://emberobserver.com/addons/ember-lifeline-decorators)
[![Ember Versions](https://img.shields.io/badge/Ember.js%20Versions-%5E2.12%20%7C%7C%20%5E3.0-brightgreen.svg)](https://travis-ci.org/buschtoens/ember-lifeline-decorators)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
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

If you are _not_ using TypeScript, in order for [ember-cli-babel](https://github.com/babel/ember-cli-babel) to understand the `@decorator` syntax, you at least also need to install [`@ember-decorators/babel-transforms`](https://github.com/ember-decorators/babel-transforms). Instead of that you can also install the [`ember-decorators`](https://github.com/ember-decorators/ember-decorators) meta package:

```bash
ember install ember-decorators
# or
ember install @ember-decorators/babel-transforms
```

## Usage

You don't need to register `runDisposables(this)` in the `willDestroy` hook. The
decorators do this for you.

### Available decorators

| Decorator                              | ember-lifeline                             | Description  |
|----------------------------------------|--------------------------------------------|--------------|
| **[`@later`](#later)**                 | [`runTask`][runTask]                       | Delay the execution of this method |
| **[`@schedule`](#schedule)**           | [`scheduleTask`][scheduleTask]             | Schedule this method on a run loop queue |
| **[`@debounce`](#debounce)**           | [`debounceTask`][debounceTask]             | Debounce this method |
| **[`@throttle`](#throttle)**           | [`throttleTask`][throttleTask]             | Throttle this method |
| **[`@disposable`](#disposable)**       | [`registerDisposable`][registerDisposable] | Automatically execute this method during `willDestroy` |
| **[`@eventListener`](#eventListener)** | [`addEventListener`][addEventListener]     | Execute this method when a DOM event is fired |

[runTask]: https://github.com/ember-lifeline/ember-lifeline#runtask
[scheduleTask]: https://github.com/ember-lifeline/ember-lifeline#scheduletask
[debounceTask]: https://github.com/ember-lifeline/ember-lifeline#debouncetask
[throttleTask]: https://github.com/ember-lifeline/ember-lifeline#throttletask
[registerDisposable]: https://github.com/ember-lifeline/ember-lifeline#registerdisposable
[addEventListener]: https://github.com/ember-lifeline/ember-lifeline#addeventlistener

#### `@later`

- **`timeout`**: *`number`* — delay in milliseconds

[`runTask`][runTask] / [`import { later } from '@ember/runloop';`](https://www.emberjs.com/api/ember/3.5/functions/@ember%2Frunloop/later)

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

- **`queue`**: *`RunLoopQueue`* — the queue to put the method in
  - `sync`
  - `actions`
  - `routerTransitions`
  - `render`
  - `destroy`

[`scheduleTask`][scheduleTask] / [`import { schedule } from '@ember/runloop';`](https://www.emberjs.com/api/ember/3.5/functions/@ember%2Frunloop/schedule)

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

- **`wait`**: *`number`* — delay in milliseconds
- **`immediate = false`**: *`boolean`* — trigger the function on the leading instead of the trailing edge of the wait interval

[`debounceTask`][debounceTask] / [`import { debounce } from '@ember/runloop';`](https://www.emberjs.com/api/ember/3.5/functions/@ember%2Frunloop/debounce)

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

- **`spacing`**: *`number`* — Number of milliseconds to space out executions
- **`immediate = true`**: *`boolean`* — trigger the function on the leading instead of the trailing edge of the wait interval

[`throttleTask`][throttleTask] / [`import { throttle } from '@ember/runloop';`](https://www.emberjs.com/api/ember/3.5/functions/@ember%2Frunloop/throttle)

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

- **`element`**: *`HTMLElement`* — element to register the listener on
- **`eventName`**: *`string`* — the event to listen for
- **`options?`**: *`object`* — optional options to pass to `addEventListener`

[`addEventListener`][addEventListener] / [`EventTarget.addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

Automatically calls this method whenever the given event is fired on `element`.

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
