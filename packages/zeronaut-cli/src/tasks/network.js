const types = require('ethernaut-common/src/validation/types');

require('../scopes/play')
  .task('network', 'Selects a network')
  .addPositionalParam(
    'name',
    'The name of the network',
    undefined,
    types.string
  )
  .setAction(async ({ name }, hre) => {
    // TODO
  });
