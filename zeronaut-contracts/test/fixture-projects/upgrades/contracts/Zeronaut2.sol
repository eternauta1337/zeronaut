// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import { OwnableStorage } from 'zeronaut-contracts/contracts/ownable/OwnableStorage.sol';

contract Zeronaut2 {
    function saySomethingElse() public pure returns (string memory) {
        return 'something else';
    }

    function getOwner() public view returns (address) {
        return OwnableStorage.getOwner();
    }
}