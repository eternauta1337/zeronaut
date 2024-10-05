// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import { UUPSImplementation } from 'zeronaut-contracts/contracts/proxy/UUPSImplementation.sol';
import { OwnableStorage } from 'zeronaut-contracts/contracts/ownable/OwnableStorage.sol';

contract Zeronaut1 is UUPSImplementation {
    function saySomething() public pure returns (string memory) {
        return 'something';
    }

    function getOwner() public view returns (address) {
        return OwnableStorage.getOwner();
    }
}
