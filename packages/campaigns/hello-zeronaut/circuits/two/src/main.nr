use std::ecdsa_secp256k1;

fn main(
    signature: [u8; 64],
    pubKeyX: pub [u8; 32],
    pubKeyY: pub [u8; 32],
    hashedMsg: [u8; 32],
    factor_1: u32,
    factor_2: u32
) {
    assert(ecdsa_secp256k1::verify_signature(pubKeyX, pubKeyY, signature, hashedMsg), "Invalid signature");
    verify_numbers(factor_1, factor_2);
}

fn verify_numbers(factor_1: u32, factor_2: u32) {
    assert(factor_1 != 1, "Factor 1 must not be 1");
    assert(factor_2 != 1, "Factor 2 must not be 1");
    assert(factor_1 * factor_2 == 1337, "Invalid numbers");
}

#[test]
fn test_main() {
    verify_numbers(1, 1337);
}
