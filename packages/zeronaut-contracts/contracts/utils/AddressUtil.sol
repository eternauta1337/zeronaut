//SPDX-License-Identifier: MIT
pragma solidity >=0.8.11 <0.9.0;

library AddressUtil {
    function isContract(address account) internal view returns (bool) {
        uint256 size;

        assembly {
            size := extcodesize(account)
        }

        return size > 0;
    }

    function computeAddressFromPublicKey(bytes32[] calldata publicInputs) internal pure returns (address) {
        require(publicInputs.length >= 64, "Invalid public inputs length");

        // Incoming publicInputs is an array of 64 bytes32 words.
        // Each word contains a chunk of the public key.
        // We need to concatenate these chunks to form the full public key.
        bytes32 pubKeyX;
        bytes32 pubKeyY;
        assembly {
            // Initialize pubKeyX and pubKeyY
            pubKeyX := 0
            pubKeyY := 0

            // Loop through the first 32 entries for pubKeyX
            for { let i := 0 } lt(i, 32) { i := add(i, 1) } {
                let word := calldataload(add(publicInputs.offset, mul(i, 32)))
                let lastByte := and(word, 0xff)
                pubKeyX := or(shl(8, pubKeyX), lastByte)
            }

            // Loop through the next 32 entries for pubKeyY
            for { let i := 32 } lt(i, 64) { i := add(i, 1) } {
                let word := calldataload(add(publicInputs.offset, mul(i, 32)))
                let lastByte := and(word, 0xff)
                pubKeyY := or(shl(8, pubKeyY), lastByte)
            }
        }

        // Combine pubKeyX and pubKeyY into a single bytes array
        bytes memory data = abi.encodePacked(pubKeyX, pubKeyY);

        // Convert the bytes array to an address
        return address(uint160(uint256(keccak256(data))));
    }
}
