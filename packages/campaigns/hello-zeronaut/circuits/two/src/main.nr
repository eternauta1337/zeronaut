use std::ecdsa_secp256k1;

fn main(
    signature: [u8; 64],
    pubKeyX: pub [u8; 32],
    pubKeyY: pub [u8; 32],
    hashedMsg: [u8; 32],
    key: u32,
    lock_1: pub u32,
    lock_2: pub u32
    ) {
    assert(ecdsa_secp256k1::verify_signature(pubKeyX, pubKeyY, signature, hashedMsg));

    assert(key != 1, "Key must not be 1");
    assert(lock_1 % key == 0, "Key must be divisible by lock_1");
    assert(lock_2 % key == 0, "Key must be divisible by lock_2");
}
