'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
  });

  const npmPackages = ['delay'];
  for (const pkg of npmPackages) {
    const modulePath = require.resolve(pkg).match(/node_modules\/.*$/)[0];
    app.import(modulePath, {
      using: [{ transformation: 'cjs', as: pkg.split('/', 2)[0] }]
    });
  }

  return app.toTree();
};
