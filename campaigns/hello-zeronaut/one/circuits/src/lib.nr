#[export]
fn main(password: str<8>) {
    assert(password == "zeronaut");
}

#[test]
fn test_main() {
    main("zeronaut");
}

#[test(should_fail)]
fn test_main_failure() {
    main("poopnaut");
}

