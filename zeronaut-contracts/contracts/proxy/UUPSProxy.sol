//SPDX-License-Identifier: MIT
pragma solidity >=0.8.11 <0.9.0;

import "./AbstractProxy.sol";
import "./ProxyStorage.sol";
import "../utils/AddressUtil.sol";
import "../errors/AddressError.sol";
import {OwnableStorage} from "../ownership/OwnableStorage.sol";

contract UUPSProxy is AbstractProxy, ProxyStorage {
    constructor(address firstImplementation, address initialOwner) {
        if (initialOwner == address(0)) {
            revert AddressError.ZeroAddress();
        }

        if (firstImplementation == address(0)) {
            revert AddressError.ZeroAddress();
        }

        if (!AddressUtil.isContract(firstImplementation)) {
            revert AddressError.NotAContract(firstImplementation);
        }

        OwnableStorage.load().owner = initialOwner;

        _proxyStore().implementation = firstImplementation;
    }

    function _getImplementation() internal view virtual override returns (address) {
        return _proxyStore().implementation;
    }
}
