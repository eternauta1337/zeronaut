//SPDX-License-Identifier: MIT
pragma solidity >=0.8.11 <0.9.0;

import "./ProxyStorage.sol";
import "../ownable/OwnableStorage.sol";
import "../utils/AddressUtil.sol";

event Upgraded(address indexed self, address implementation);

abstract contract UUPSImplementation is ProxyStorage {
    function upgradeTo(address newImplementation) external {
        OwnableStorage.onlyOwner();

        if (newImplementation == address(0)) {
            revert("UUPSImplementation: Zero address");
        }

        if (!AddressUtil.isContract(newImplementation)) {
            revert("UUPSImplementation: Not a contract");
        }

        ProxyStore storage store = _proxyStore();

        if (newImplementation == store.implementation) {
            revert("UUPSImplementation: No change");
        }

        store.implementation = newImplementation;

        emit Upgraded(address(this), newImplementation);
    }

    function getImplementation() external view returns (address) {
        return _proxyStore().implementation;
    }
}
