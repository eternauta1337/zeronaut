use std::ecdsa_secp256k1;

fn main(
    signature: [u8; 64],
    pubKeyX: pub [u8; 32],
    pubKeyY: pub [u8; 32],
    hashedMsg: [u8; 32],
    number: pub u32,
    factor_1: u32,
    factor_2: u32
) {
    assert(ecdsa_secp256k1::verify_signature(pubKeyX, pubKeyY, signature, hashedMsg), "Invalid signature");
    verify_numbers(number, factor_1, factor_2);
}

fn verify_numbers(number: u32, factor_1: u32, factor_2: u32) {
    assert(number == 1337, "Number must be 1337");
    assert(factor_1 * factor_2 == number, "Invalid numbers");
}

#[test]
fn test_main() {
    verify_numbers(1337, 1, 1);
}
