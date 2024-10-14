use std::ecdsa_secp256k1;

fn main(
    signature: [u8; 64],
    pubKeyX: pub [u8; 32],
    pubKeyY: pub [u8; 32],
    hashedMsg: [u8; 32],
    password: str<8>
) {
    assert(ecdsa_secp256k1::verify_signature(pubKeyX, pubKeyY, signature, hashedMsg), "Invalid signature");
    assert(verify_password(password), "Invalid password");
}

fn verify_password(password: str<8>) -> bool {
    let hashed_password = std::hash::sha256(password.as_bytes());
    let expected_hash = [
        5, 59, 30, 126, 135, 161, 2, 255,
        48, 205, 62, 245, 120, 147, 242, 127,
        235, 223, 224, 73, 13, 61, 44, 29,
        240, 7, 205, 243, 57, 221, 191, 209
    ];
    hashed_password == expected_hash
}

#[test]
fn test_main() {
    let password = "xxxxxxxx";
    let hashed_password = std::hash::sha256(password.as_bytes());
    std::println(hashed_password);
    assert(verify_password(password));
}
