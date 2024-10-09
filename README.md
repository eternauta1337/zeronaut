# Zeronaut POC

## Instructions

1. Clone the repo
2. Run `npm install`
3. Start a local chain
   1. `cd packages/zeronaut-contracts`
   2. `npx hardhat node`
4. Deploy the main contract
   1. `cd packages/zeronaut-contracts`
   2. `npm run deploy`
5. Deploy the levels
   1. `cd packages/campaigns/hello-zeronaut`
   2. `npm run deploy`
   3. `npm run register`
6. Play the game!
   1. `cd packages/zeronaut-cli`
   2. `npx hardhat play`
      1. `set-campaign hello-zeronaut`
      2. `set-level One`
      3. `play-level`
