const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('AccesoriesModule', (m) => {
  let accesories = {};

  // Codebreaker
  accesories.safu = m.contract('Safu', []);
  const checkPassword = m.staticCall(accesories.safu, 'checkPassword', [
    'hello',
  ]);
  const codebreaker = m.contract('CodeBreaker', ['hello'], {
    after: [checkPassword],
  });
  console.log('codebreaker', accesories);

  // Txx
  // TODO

  // Zxx
  // TODO

  return { accesories };
});
