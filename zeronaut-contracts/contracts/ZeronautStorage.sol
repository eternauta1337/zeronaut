//SPDX-License-Identifier: MIT
pragma solidity >=0.8.11 <0.9.0;

abstract contract ZeronautStorage {
    bytes32 private constant _SLOT_ZERONAUT_STORAGE =
        keccak256(abi.encode("io.zeronaut"));

    struct Data {
        mapping(bytes32 => Campaign) campaigns;
        mapping(bytes32 => Level) levels;
        // levelId -> playerAddress -> levelSolved
        mapping(bytes32 => mapping(address => bool)) solvers;
    }

    struct Campaign {
        bytes32 id;
        address owner;
        bytes32[] levels;
    }

    struct Level {
        bytes32 id;
        address addr;
        bytes32 campaignId;
    }

    function _store() internal pure returns (Data storage store) {
        bytes32 s = _SLOT_ZERONAUT_STORAGE;
        assembly {
            store.slot := s
        }
    }
}
