// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {UltraVerifier} from "./Verifier.sol";
import {ILevel} from "zeronaut-contracts/contracts/interfaces/ILevel.sol";
import {Zeronaut} from "zeronaut-contracts/contracts/Zeronaut.sol";

contract One is ILevel, UltraVerifier {
    function instructions() public pure returns (string memory) {
        return "If you played Ethernaut, you should know the password.";
    }

    function check(bytes calldata proof, bytes32[] calldata publicInputs) public view returns (bool) {
        return this.verify(proof, publicInputs);
    }

    function circuit() public pure returns (string memory) {
        return "{\"abi\":{\"parameters\":[{\"name\":\"password\",\"type\":{\"kind\":\"string\",\"length\":8},\"visibility\":\"private\"},{\"name\":\"signature\",\"type\":{\"kind\":\"array\",\"length\":64,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"},{\"name\":\"pubKeyX\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"public\"},{\"name\":\"pubKeyY\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"public\"},{\"name\":\"hashedMsg\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"}],\"return_type\":null,\"error_types\":{}},\"bytecode\":\"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\"}";
    }
}
