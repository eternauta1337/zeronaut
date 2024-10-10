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
        199, 103, 41, 126, 137, 220, 152, 30,
        195, 196, 137, 133, 31, 83, 173, 140,
        108, 77, 175, 47, 179, 143, 212, 177,
        189, 10, 72, 46, 176, 171, 88, 177
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
