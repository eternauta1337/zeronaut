// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract Safu {
    function checkPassword(string memory _password) public pure returns (bool) {
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked("zeronaut"));
    }
}
