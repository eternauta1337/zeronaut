// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ILevel } from "./interfaces/ILevel.sol";
import { IVerifier } from "./interfaces/IVerifier.sol";
import { OwnableStorage } from "./ownable/OwnableStorage.sol";

contract Level is ILevel {
    string _instructions;
    string _circuit;
    IVerifier _verifier;

    constructor() {
        OwnableStorage.load().owner = msg.sender;
    }

    function instructions() virtual public view returns (string memory) {
        return _instructions;
    }

    function setInstructions(string memory newInstructions) public {
        OwnableStorage.onlyOwner();
        _instructions = newInstructions;
    }

    function circuit() virtual public view returns (string memory) {
        return _circuit;
    }

    function setCircuit(string memory newCircuit) public {
        OwnableStorage.onlyOwner();
        _circuit = newCircuit;
    }

    function verifier() virtual public view returns (IVerifier) {
        return _verifier;
    }

    function setVerifier(address newVerifier) public {
        OwnableStorage.onlyOwner();
        _verifier = IVerifier(newVerifier);
    }

    function check(bytes calldata proof, bytes32[] calldata publicInputs) public view returns (bool) {
        return IVerifier(_verifier).verify(proof, publicInputs);
    }
}
