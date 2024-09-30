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

    function instructions() public pure returns (string memory) {
        return "If you played Ethernaut, you should know the password.";
    }

    function check(bytes calldata proof, bytes32[] calldata publicInputs) public view returns (bool) {
        // TODO: require address in public inputs is msg.sender

        return verifier.verify(proof, publicInputs);
    }

    function circuit() public pure returns (string memory) {
        return "{\"abi\":{\"parameters\":[{\"name\":\"password\",\"type\":{\"kind\":\"string\",\"length\":8},\"visibility\":\"private\"},{\"name\":\"signature\",\"type\":{\"kind\":\"array\",\"length\":64,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"},{\"name\":\"pubKeyX\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"},{\"name\":\"pubKeyY\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"},{\"name\":\"hashedMsg\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"}],\"return_type\":null,\"error_types\":{}},\"bytecode\":\"H4sIAAAAAAAA/7XXZW/bVwBG8X+Wjpl5S9dBxsbYHjVdBxkzU8hexsyUccfMlHG0T7kc+T5Sd97sRW1L1u1RJffKtR/9PFENH+sbz3/Knyc2npMbz73KM723eh/1vur91PurD1AfqD5IfbD6EPWh6sPUh6uPUB+pPkp9tPoY9bHq49THq09Qn6ieUm9Wn6Teoj5ZfYr6VPVp6mn16eoz1Geqz1KfrT5Hfa66pq6rG+qmuqVuq2fUHXVX3VOfpz5ffYH6QvVF6q3qWfU29cXq7epL1JeqL1Nfrp5TX6G+Un2V+mr1Nepr1depr1ffoL5RfZP6ZvUt6lvVt6lvV9+hvlN9l/pu9T3qe9X3qefVC+pF9ZJ6Wd1XD9T3q1fUD6gfVD+kflj9iPpR9WPqx9VPqJ9UP6V+Wv2M+ln1c+rn1S+oX1S/pH5Z/Yr6VfVr6lX16+o31G+q31K/rX5H/a56h/o99fvqD9Qfqj9Sf6z+RP2p+jP15+ov1F+qv1J/rf5G/a36O/X36h/UP6p/Uv+s/kW9pv5V/Zv6d/Uf6j/Vf6n/3qmx3Vzp7H72Pjuffc+uZ8+z49nv7Hb2Ojudfc4uZ4+zw9nf7G72Njubfc2uZk+zo/PlXChn9nKpnNnH7GL2MDu4Us7sXvYuO5d9y65lz7Jj2a/sVvYqO5V9yi5lj7JD2Z/sTvYmO5N9ya5kT7Ijq+XMb\"}";
    }
}
