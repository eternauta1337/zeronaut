// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {UltraVerifier} from "./Verifier.sol";

contract Safuest is UltraVerifier {
    mapping(address => bool) public solvers;

    function checkProof(bytes calldata proof, bytes32[] calldata publicInputs) public view returns (bool) {
        return this.verify(proof, publicInputs);
    }

    function solve(bytes calldata proof, bytes32[] calldata publicInputs) public {
        solvers[msg.sender] = checkProof(proof, publicInputs);
    }
}
