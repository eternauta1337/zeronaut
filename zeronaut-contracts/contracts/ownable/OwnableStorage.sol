//SPDX-License-Identifier: MIT
pragma solidity >=0.8.11 <0.9.0;

library OwnableStorage {
    bytes32 private constant _SLOT_OWNABLE_STORAGE =
        keccak256(abi.encode("io.zeronaut.ownable"));

    struct Data {
        address owner;
        address nominatedOwner;
    }

    function load() internal pure returns (Data storage store) {
        bytes32 s = _SLOT_OWNABLE_STORAGE;
        assembly {
            store.slot := s
        }
    }

    function onlyOwner() internal view {
        if (msg.sender != getOwner()) {
            revert("OwnableStorage: Caller is not the owner");
        }
    }

    function getOwner() internal view returns (address) {
        return OwnableStorage.load().owner;
    }
}
