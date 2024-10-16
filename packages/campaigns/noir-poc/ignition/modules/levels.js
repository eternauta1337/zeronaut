const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

const AccesoriesModule = require('./accessories');

module.exports = buildModule('LevelsModule', (m) => {
  const stuff = m.useModule(AccesoriesModule);
  console.log('stuff', stuff);

  let levels = {};

  // Codebreaker
  // const safu = m.contract('Safu', [], {
  //   id: 'Safu',
  // });
  // const instructions = `What is the password required by ${safu}?`;
  levels.codebreaker = m.contract('CodeBreaker', ['hello'], {
    after: [stuff],
  });

  // Txx
  // TODO

  // Zxx
  // TODO

  return levels;
});
