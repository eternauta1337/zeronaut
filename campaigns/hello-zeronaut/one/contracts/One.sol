// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "hardhat/console.sol";

import "./Verifier.sol";
import {ILevel} from "zeronaut/contracts/interfaces/ILevel.sol";

contract One is ILevel {
    UltraVerifier verifier;

    constructor(address _verifier) payable {
        verifier = UltraVerifier(_verifier);
    }

    function name() public pure returns (bytes32) {
        return "One";
    }

    function instructions() public pure returns (string memory) {
        return "If you played Ethernaut, you should know the password.";
    }

    function check(bytes calldata proof, bytes32[] calldata publicInputs) public view returns (bool) {
        return verifier.verify(proof, publicInputs);
    }

    function circuit() public pure returns (string memory) {
        return "{\"abi\":{\"parameters\":[{\"name\":\"password\",\"type\":{\"kind\":\"string\",\"length\":8},\"visibility\":\"private\"}],\"return_type\":null,\"error_types\":{}},\"bytecode\":\"H4sIAAAAAAAA/7WTSw7DIAxEQ3/kODaGYO96ldDA/Y/QWs2iajeVYj8JeWc9DZ4wvYmvN0+/hH3e9wnHwM9dBEvOvaaOhCskaVwgl7YwMhYuW2KizpmrNKkgmKnjKEJ9KFw9PYOZpzw8PU92eQ5Pz7NdnsnT82LnSZ6eVzPPFTw9b3b36dqjaOe56Y75y1V7qh3Q+9K/01zi9AdPMx5GVqEFAAA=\"}";
    }
}
