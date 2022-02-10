use serde_repr::Serialize_repr;

#[derive(Serialize_repr, Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum GameStatus {
    Pending = 0,
    InProgress = 1,
    Over = 2,
}
