// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "hardhat/console.sol";

import "./Verifier.sol";
import {ILevel} from "zeronaut/contracts/interfaces/ILevel.sol";
import {Zeronaut} from "zeronaut/contracts/Zeronaut.sol";

contract Two is ILevel {
    UltraVerifier verifier;

    constructor(address _verifier) payable {
        verifier = UltraVerifier(_verifier);
    }

    function instructions() public pure returns (string memory) {
        return "Can you find a number that divides both 187 and 459?";
    }

    function check(bytes calldata proof, bytes32[] calldata publicInputs) public view returns (bool) {
        return verifier.verify(proof, publicInputs);
    }

    function circuit() public pure returns (string memory) {
        return "{\"abi\":{\"parameters\":[{\"name\":\"signature\",\"type\":{\"kind\":\"array\",\"length\":64,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"},{\"name\":\"pubKeyX\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"public\"},{\"name\":\"pubKeyY\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"public\"},{\"name\":\"hashedMsg\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"},{\"name\":\"key\",\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":32},\"visibility\":\"private\"},{\"name\":\"lock_1\",\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":32},\"visibility\":\"public\"},{\"name\":\"lock_2\",\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":32},\"visibility\":\"public\"}],\"return_type\":null,\"error_types\":{}},\"bytecode\":\"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\"}";
    }
}
