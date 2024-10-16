// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {UltraVerifier} from "./Verifier.sol";
import {ILevel} from "zeronaut-contracts/contracts/interfaces/ILevel.sol";
import {Zeronaut} from "zeronaut-contracts/contracts/Zeronaut.sol";

contract Zxx is ILevel, UltraVerifier {
    string _instructions;

    constructor(string memory __instructions) {
        _instructions = __instructions;
    }

    function instructions() public view returns (string memory) {
        return _instructions;
    }

    function check(bytes calldata proof, bytes32[] calldata publicInputs) public view returns (bool) {
        return this.verify(proof, publicInputs);
    }

    function circuit() public pure returns (string memory) {
        return "{\"abi\":{\"parameters\":[{\"name\":\"signature\",\"type\":{\"kind\":\"array\",\"length\":64,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"},{\"name\":\"pubKeyX\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"public\"},{\"name\":\"pubKeyY\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"public\"},{\"name\":\"hashedMsg\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"},{\"name\":\"password\",\"type\":{\"kind\":\"string\",\"length\":2},\"visibility\":\"private\"}],\"return_type\":null,\"error_types\":{}},\"bytecode\":\"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\"}";
    }
}


