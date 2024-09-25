// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "../interfaces/ILevel.sol";

contract DummyLevel is ILevel {
    function name() external pure returns (bytes32) {
        return "Dummy Level";
    }

    function instructions() external pure returns (string memory) {
        return "Dummy level instructions";
    }

    function check(bytes calldata proof, bytes32[] calldata) external pure returns (bool) {
        return bytes32(proof) == bytes32("dummy");
    }

    function circuit() external pure returns (string memory) {
        return "{}";
    }
}