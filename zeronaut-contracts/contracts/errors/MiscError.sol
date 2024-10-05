//SPDX-License-Identifier: MIT
pragma solidity >=0.8.11 <0.9.0;

/**
 * @title Library for change related errors.
 */
library MiscError {
    /**
     * @dev Thrown when a change is expected but none is detected.
     */
    error NoChange();
}
