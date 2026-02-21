export enum x86_op_type {
  INVALID = 0, // = CS_OP_INVALID (Uninitialized).
  REG, // = CS_OP_REG (Register operand).
  IMM, // = CS_OP_IMM (Immediate operand).
  MEM, // = CS_OP_MEM (Memory operand).
}
