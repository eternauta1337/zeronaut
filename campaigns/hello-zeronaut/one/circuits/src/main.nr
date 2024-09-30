use std::ecdsa_secp256k1;

#[export]
fn main(
    password: str<8>,
    signature: [u8; 64],
    pubKeyX: pub [u8; 32],
    pubKeyY: pub [u8; 32],
    hashedMsg: [u8; 32]
) {
    assert(ecdsa_secp256k1::verify_signature(pubKeyX, pubKeyY, signature, hashedMsg));
    assert(password == "zeronaut");
}
