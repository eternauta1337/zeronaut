//SPDX-License-Identifier: MIT
pragma solidity >=0.8.11 <0.9.0;

library ProxyStorage {
    bytes32 private constant _SLOT_PROXY_STORAGE =
        keccak256(abi.encode("io.zeronaut.proxy"));

    struct Store {
        address implementation;
        bool simulatingUpgrade;
    }

    function load() internal pure returns (Store storage store) {
        bytes32 s = _SLOT_PROXY_STORAGE;
        assembly {
            store.slot := s
        }
    }
}
