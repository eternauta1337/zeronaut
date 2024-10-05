//SPDX-License-Identifier: MIT
pragma solidity >=0.8.11 <0.9.0;

import "../errors/AddressError.sol";
import "../utils/AddressUtil.sol";
import "../errors/MiscError.sol";
import "./ProxyStorage.sol";

event Upgraded(address indexed self, address implementation);

abstract contract UUPSImplementation is ProxyStorage {
    function upgradeTo(address newImplementation) internal virtual {
        if (newImplementation == address(0)) {
            revert AddressError.ZeroAddress();
        }

        if (!AddressUtil.isContract(newImplementation)) {
            revert AddressError.NotAContract(newImplementation);
        }

        ProxyStore storage store = _proxyStore();

        if (newImplementation == store.implementation) {
            revert MiscError.NoChange();
        }

        store.implementation = newImplementation;

        emit Upgraded(address(this), newImplementation);
    }

    function getImplementation() external view returns (address) {
        return _proxyStore().implementation;
    }
}
