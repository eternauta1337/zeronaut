# Zeronaut POC

## Instructions

1. Clone the repo
2. Run `npm install`
3. Start a local chain
   3.1 `cd packages/zeronaut-contracts`
   3.2 `npx hardhat node`
4. Deploy the main contract
   4.1 `cd packages/zeronaut-contracts`
   4.2 `npm run deploy`
5. Deploy the levels
   5.1 `cd packages/campaigns/hello-zeronaut`
   5.2 `npm run deploy`
   5.3 `npm run register`
6. Play the game!
   6.1 `cd packages/zeronaut-cli`
   6.2 `npx hardhat play`
