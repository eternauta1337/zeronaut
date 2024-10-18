// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract Safuer {
    mapping(address => bool) public solvers;

    function checkPassword(string memory _password) public pure returns (bool) {
        return keccak256(abi.encodePacked(_password)) == 0xb01345a7cb32d90f4cad78d472caaaa40708f1221e1fa8eb48367627a977ac65;
    }

    function solve(string memory _password) public {
        solvers[msg.sender] = checkPassword(_password);
    }
}
