import { load, Def } from '@cheatron/win32-ext';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { LPVOID, SIZE_T, UINT32, INT32, UINT64, csh } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface CapstoneFunctions {
  cs_version: (_major: LPVOID, _minor: LPVOID) => UINT32;
  cs_support: (_query: INT32) => boolean;
  cs_open: (_arch: INT32, _mode: INT32, _handle: LPVOID) => INT32;
  cs_close: (_handle: LPVOID) => INT32;
  cs_option: (_handle: csh, _type: INT32, _value: UINT64) => INT32;
  cs_errno: (_handle: csh) => INT32;
  cs_strerror: (_code: INT32) => LPVOID;
  cs_disasm: (
    _handle: csh,
    _code: LPVOID,
    _code_size: SIZE_T,
    _address: UINT64,
    _count: SIZE_T,
    _insn: LPVOID,
  ) => SIZE_T;
  cs_free: (_insn: LPVOID, _count: SIZE_T) => void;
  cs_reg_name: (_handle: csh, _reg_id: UINT32) => LPVOID;
  cs_insn_name: (_handle: csh, _insn_id: UINT32) => LPVOID;
  cs_group_name: (_handle: csh, _group_id: UINT32) => LPVOID;
}

export const CapstoneDef = {
  cs_version: [Def.uint32, [Def.int32Ptr, Def.int32Ptr]],
  cs_support: [Def.bool, [Def.int32]],
  cs_open: [Def.int32, [Def.int32, Def.int32, Def.uint64Ptr]],
  cs_close: [Def.int32, [Def.uint64Ptr]],
  cs_option: [Def.int32, [Def.uint64, Def.int32, Def.uint64]],
  cs_errno: [Def.int32, [Def.uint64]],
  cs_strerror: [Def.charPtr, [Def.int32]],
  cs_disasm: [
    Def.uint64,
    [
      Def.uint64,
      Def.voidPtr,
      Def.uint64,
      Def.uint64,
      Def.uint64,
      Def.voidPtrPtr,
    ],
  ],
  cs_free: [Def.void, [Def.voidPtr, Def.uint64]],
  cs_reg_name: [Def.charPtr, [Def.uint64, Def.uint32]],
  cs_insn_name: [Def.charPtr, [Def.uint64, Def.uint32]],
  cs_group_name: [Def.charPtr, [Def.uint64, Def.uint32]],
};

export const CapstoneImpl = load<CapstoneFunctions>({
  dll: join(__dirname, '../../deps/capstone.dll'),
  dllFuncs: CapstoneDef,
});
