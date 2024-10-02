cd circuits

nargo compile
bb write_vk -b ./target/circuits.json
bb contract
mv -f ./target/contract.sol ../contracts/Verifier.sol

cd ..