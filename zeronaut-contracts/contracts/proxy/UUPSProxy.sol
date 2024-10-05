//SPDX-License-Identifier: MIT
pragma solidity >=0.8.11 <0.9.0;

import "./ProxyStorage.sol";
import "../utils/AddressUtil.sol";
import {OwnableStorage} from "../ownable/OwnableStorage.sol";

contract UUPSProxy is ProxyStorage {
    constructor(address firstImplementation, address initialOwner) {
        if (initialOwner == address(0)) {
            revert("UUPSProxy: Owner is zero");
        }

        if (firstImplementation == address(0)) {
            revert("UUPSProxy: Implementation is zero");
        }

        if (!AddressUtil.isContract(firstImplementation)) {
            revert("UUPSProxy: Implementation not a contract");
        }

        OwnableStorage.load().owner = initialOwner;

        _proxyStore().implementation = firstImplementation;
    }

    fallback() external payable {
        _forward();
    }

    receive() external payable {
        _forward();
    }

    function _forward() internal {
        address implementation = _getImplementation();

        // solhint-disable-next-line no-inline-assembly
        assembly {
            calldatacopy(0, 0, calldatasize())

            let result := delegatecall(gas(), implementation, 0, calldatasize(), 0, 0)

            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    function _getImplementation() internal view virtual returns (address) {
        return _proxyStore().implementation;
    }
}
