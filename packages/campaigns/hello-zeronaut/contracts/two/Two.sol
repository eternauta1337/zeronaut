// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "hardhat/console.sol";

import {UltraVerifier} from "./Verifier.sol";
import {ILevel} from "zeronaut-contracts/contracts/interfaces/ILevel.sol";
import {Zeronaut} from "zeronaut-contracts/contracts/Zeronaut.sol";

contract Two is ILevel, UltraVerifier {
    function instructions() public pure returns (string memory) {
        return "Can you find the prime factors of 1337?";
    }

    function check(bytes calldata proof, bytes32[] calldata publicInputs) public view returns (bool) {
        return this.verify(proof, publicInputs);
    }

    function circuit() public pure returns (string memory) {
        return "{\"abi\":{\"parameters\":[{\"name\":\"signature\",\"type\":{\"kind\":\"array\",\"length\":64,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"},{\"name\":\"pubKeyX\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"public\"},{\"name\":\"pubKeyY\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"public\"},{\"name\":\"hashedMsg\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"},{\"name\":\"number\",\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":32},\"visibility\":\"public\"},{\"name\":\"factor_1\",\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":32},\"visibility\":\"private\"},{\"name\":\"factor_2\",\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":32},\"visibility\":\"private\"}],\"return_type\":null,\"error_types\":{}},\"bytecode\":\"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\"}";
    }
}
