// SPDX-License-iDEntifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";

import "./Verifier.sol";

contract One {
    UltraVerifier verifier;

    constructor(address _verifier) payable {
        verifier = UltraVerifier(_verifier);
    }

    function instructions() public pure returns (string memory) {
        return "If you played Ethernaut, you should know the password.";
    }

    function check(bytes calldata proof, bytes32[] calldata publicInputs) public view returns (bool) {
        return verifier.verify(proof, publicInputs);
    }
}
