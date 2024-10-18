use std::ecdsa_secp256k1;

fn main(
    signature: [u8; 64],
    pubKeyX: pub [u8; 32],
    pubKeyY: pub [u8; 32],
    hashedMsg: [u8; 32],
    password: str<2>
) {
    assert(ecdsa_secp256k1::verify_signature(pubKeyX, pubKeyY, signature, hashedMsg), "Invalid signature");
    assert(verify_password(password), "Invalid password");
}

fn verify_password(password: str<2>) -> bool {
    let hashed_password = std::hash::sha256(password.as_bytes());
    let expected_hash = [
        147, 144, 41, 143,
        63, 176, 197, 177,
        96, 73, 137, 53,
        215, 156, 177, 57,
        174, 242, 142, 28,
        71, 53, 139, 75,
        187, 166, 24, 98,
        185, 194, 110, 89
    ];
    hashed_password == expected_hash
}

#[test]
fn test_main() {
    let password = "xx";
    let hashed_password = std::hash::sha256(password.as_bytes());
    std::println(hashed_password);
    assert(verify_password(password));
}
