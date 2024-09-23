// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

interface ILevel {
    function instructions() external view returns (string memory);
    function check(bytes calldata proof, bytes32[] calldata publicInputs) external view returns (bool);
}