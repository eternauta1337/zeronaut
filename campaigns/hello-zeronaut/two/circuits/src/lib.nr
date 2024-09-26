#[export]
fn main(key: u32, lock_1: pub u32, lock_2: pub u32) {
    assert(key != 1, "Key must not be 1");
    assert(lock_1 % key == 0, "Key must be divisible by lock_1");
    assert(lock_2 % key == 0, "Key must be divisible by lock_2");
}
