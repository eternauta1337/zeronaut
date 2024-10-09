use std::ecdsa_secp256k1;

fn main(
    password: str<8>,
    signature: [u8; 64],
    pubKeyX: pub [u8; 32],
    pubKeyY: pub [u8; 32],
    hashedMsg: [u8; 32]
) {
    assert(ecdsa_secp256k1::verify_signature(pubKeyX, pubKeyY, signature, hashedMsg), "Invalid signature");
    assert(verify_password(password), "Invalid password");
}

fn verify_password(password: str<8>) -> bool {
    let hashed_password = std::hash::sha256(password.as_bytes());
    let expected_hash = [
        55, 53, 139, 161, 108, 80, 87, 143,
        89, 18, 186, 8, 13, 11, 147, 219,
        134, 172, 94, 208, 232, 78, 48, 137,
        194, 14, 143, 118, 208, 143, 230, 139
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
