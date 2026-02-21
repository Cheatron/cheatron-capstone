import type {
  UINT32,
  INT32,
  UINT16,
  UINT8,
  INT64,
  UINT64,
  HANDLE,
  LPVOID,
  SIZE_T,
} from '@cheatron/win32-ext';

export type {
  UINT32,
  INT32,
  UINT16,
  UINT8,
  INT64,
  UINT64,
  HANDLE,
  LPVOID,
  SIZE_T,
};

export interface Detail {
  regs_read: number[];
  regs_read_count: number;
  regs_write: number[];
  regs_write_count: number;
  groups: number[];
  groups_count: number;
}

export interface Instruction {
  id: number;
  address: bigint;
  size: number;
  bytes: number[];
  mnemonic: string;
  op_str: string;
  detail?: Detail;
}

/**
 * Handle using with all API
 */
export type csh = HANDLE;

export * from './cs_arch';
export * from './cs_mode';
export * from './cs_err';
export * from './cs_opt_type';
export * from './cs_opt_value';

export const CS_MNEMONIC_SIZE = 32;
export const CS_INSN_BYTES_MAX = 24;

export * from './x86';
