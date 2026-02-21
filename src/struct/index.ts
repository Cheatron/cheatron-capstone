import { ffi, Def } from '@cheatron/win32-ext';
import { CS_MNEMONIC_SIZE } from '../types';

export const cs_x86_encoding = ffi.struct('cs_x86_encoding', {
  modrm_offset: Def.uint8,
  disp_offset: Def.uint8,
  disp_size: Def.uint8,
  imm_offset: Def.uint8,
  imm_size: Def.uint8,
});

export const x86_op_mem = ffi.struct('x86_op_mem', {
  segment: Def.uint32, // x86_reg is enum (int)
  base: Def.uint32,
  index: Def.uint32,
  scale: Def.int32,
  disp: Def.int64,
});

export const cs_x86_op = ffi.struct('cs_x86_op', {
  type: Def.int32, // x86_op_type
  __union: ffi.union({
    reg: Def.uint32, // x86_reg
    imm: Def.int64,
    mem: x86_op_mem,
  }),
  size: Def.uint8,
  access: Def.uint8, // cs_ac_type
  avx_bcast: Def.int32, // x86_avx_bcast
  avx_zero_opmask: Def.bool,
});

// Windows Capstone 4.0.2 struct
export const cs_x86 = ffi.struct('cs_x86', {
  prefix: ffi.array(Def.uint8, 4),
  opcode: ffi.array(Def.uint8, 4),
  rex: Def.uint8,
  addr_size: Def.uint8,
  modrm: Def.uint8,
  sib: Def.uint8,
  disp: Def.int64,
  sib_index: Def.uint32, // x86_reg
  sib_scale: Def.int8,
  sib_base: Def.uint32, // x86_reg
  xop_cc: Def.int32, // x86_xop_cc
  sse_cc: Def.int32, // x86_sse_cc
  avx_cc: Def.int32, // x86_avx_cc
  avx_sae: Def.bool,
  avx_rm: Def.int32, // x86_avx_rm
  __union: ffi.union({
    eflags: Def.uint64,
    fpu_flags: Def.uint64,
  }),
  op_count: Def.uint8,
  operands: ffi.array(cs_x86_op, 8),
  encoding: cs_x86_encoding,
});

export const cs_detail = ffi.struct('cs_detail', {
  regs_read: ffi.array(Def.uint16, 12),
  regs_read_count: Def.uint8,
  regs_write: ffi.array(Def.uint16, 20),
  regs_write_count: Def.uint8,
  groups: ffi.array(Def.uint8, 8),
  groups_count: Def.uint8,
  x86: cs_x86,
});

// Windows Capstone 4.0.2 uses 16 bytes for max instruction
export const cs_insn = ffi.struct('cs_insn', {
  id: Def.uint32,
  address: Def.uint64,
  size: Def.uint16,
  bytes: ffi.array(Def.uint8, 16),
  mnemonic: ffi.array(Def.uint8, CS_MNEMONIC_SIZE),
  op_str: ffi.array(Def.uint8, 160),
  detail: ffi.pointer(cs_detail),
});
