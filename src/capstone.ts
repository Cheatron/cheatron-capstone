import {
    cs_arch,
    cs_mode,
    cs_err,
    cs_opt_type,
    cs_opt_value,
    x86_op_type
} from './types';
import type { 
    UINT32, 
    INT32, 
    UINT64, 
    csh, 
    LPVOID,
    X86Detail
} from './types';
import { Instruction, type RawInstruction } from './instruction';
import { CapstoneImpl } from './def';
import { cs_insn, cs_detail } from './struct';
import { ffi } from '@cheatron/win32-ext';

export * from './types';
export * from './struct';
export * from './def';

function closeHandle(handle: csh): void {
    const handlePtr = Buffer.alloc(8);
    handlePtr.writeBigUint64LE(BigInt(handle));
    CapstoneImpl.cs_close(handlePtr as unknown as LPVOID);
}

const registry = new FinalizationRegistry((handle: csh) => {
    closeHandle(handle);
});

export class Capstone<T extends Instruction = Instruction> {
    protected handle: csh = 0n;

    constructor(arch: cs_arch, mode: cs_mode) {
        const handlePtr = Buffer.alloc(8);
        const err = CapstoneImpl.cs_open(arch, mode, handlePtr as unknown as LPVOID);
        if (err !== cs_err.OK) {
            throw new Error(`Failed to open Capstone handle: ${cs_err[err] || err}`);
        }
        this.handle = handlePtr.readBigUint64LE();
        registry.register(this, this.handle, this);
    }

    static version(): { major: number; minor: number } {
        const majorPtr = Buffer.alloc(4);
        const minorPtr = Buffer.alloc(4);
        CapstoneImpl.cs_version(majorPtr as unknown as LPVOID, minorPtr as unknown as LPVOID);
        return {
            major: majorPtr.readInt32LE(),
            minor: minorPtr.readInt32LE(),
        };
    }

    static support(query: number): boolean {
        return CapstoneImpl.cs_support(query);
    }

    option(type: cs_opt_type, value: cs_opt_value | UINT64): void {
        const val = typeof value === 'bigint' ? value : BigInt(value);
        const err = CapstoneImpl.cs_option(this.handle, type, val);
        if (err !== cs_err.OK) {
            throw new Error(`Failed to set option: ${cs_err[err] || err}`);
        }
    }

    onDetail(): void {
        this.option(cs_opt_type.DETAIL, BigInt(cs_opt_value.ON));
    }

    offDetail(): void {
        this.option(cs_opt_type.DETAIL, BigInt(cs_opt_value.OFF));
    }

    errno(): INT32 {
        return CapstoneImpl.cs_errno(this.handle);
    }

    strerror(code: INT32): string {
        return (CapstoneImpl.cs_strerror(code) as unknown as string) || 'Unknown error';
    }

    disasm(code: Buffer, address: bigint, count: number = 0): T[] {
        const insnPtrPtr = Buffer.alloc(8);
        const resultCount = CapstoneImpl.cs_disasm(
            this.handle,
            code as unknown as LPVOID,
            code.length,
            BigInt(address),
            count,
            insnPtrPtr as unknown as LPVOID
        );

        const resultCountBig = BigInt(resultCount);
        if (resultCountBig <= 0n) {
            return [];
        }

        const insnPtr = ffi.decode(insnPtrPtr, 'void*');
        const countNum = Number(resultCountBig);
        const insns = ffi.decode(insnPtr, ffi.array(cs_insn, countNum)) as RawInstruction[];
        
        const results = insns.map((insn) => {
            const res = { ...insn } as RawInstruction;

            // Decode char arrays back to strings
            if (res.mnemonic) {
                const mnemonicBuf = Buffer.from(res.mnemonic);
                res.mnemonic = mnemonicBuf.toString().split('\0')[0];
            }
            if (res.op_str) {
                const opStrBuf = Buffer.from(res.op_str);
                res.op_str = opStrBuf.toString().split('\0')[0];
            }

            // Convert bytes/mnemonic/op_str to regular arrays/strings in res
            res.bytes = Array.from(res.bytes.slice(0, res.size));

            // Decode detail if present
            if (res.detail) {
                const detailPtr = (res.detail as any);
                const detailData = ffi.decode(detailPtr, cs_detail) as X86Detail;
                const detail = { ...detailData };
                res.detail = detail;

                // Handle X86 specific deep copy and array/buffer conversions
                if (detail.x86) {
                    const x86 = { ...detail.x86 };
                    x86.prefix = Array.from(x86.prefix);
                    x86.opcode = Array.from(x86.opcode);

                    // Filter operands by count and clean up unions
                    x86.operands = x86.operands.slice(0, x86.op_count).map((op: any) => {
                        const newOp = { ...op };
                        if (op.__union) {
                            if (newOp.type === x86_op_type.REG) {
                                newOp.reg = op.__union.reg;
                            } else if (newOp.type === x86_op_type.IMM) {
                                newOp.imm = op.__union.imm;
                            } else if (newOp.type === x86_op_type.MEM) {
                                newOp.mem = op.__union.mem;
                            }
                            delete newOp.__union;
                        }
                        return newOp;
                    });

                    // Clean up x86 union
                    if ((x86 as any).__union) {
                        Object.assign(x86, (x86 as any).__union);
                        delete (x86 as any).__union;
                    }

                    detail.x86 = x86;
                }

                // Clean up implicit regs/groups based on counts
                detail.regs_read = Array.from(detail.regs_read.slice(0, detail.regs_read_count));
                detail.regs_write = Array.from(detail.regs_write.slice(0, detail.regs_write_count));
                detail.groups = Array.from(detail.groups.slice(0, detail.groups_count));
            }

            return res as T;
        });

        CapstoneImpl.cs_free(insnPtr, resultCount);
        return results;
    }

    regName(regId: UINT32): string {
        return (CapstoneImpl.cs_reg_name(this.handle, regId) as unknown as string) || '';
    }

    insnName(insnId: UINT32): string {
        return (CapstoneImpl.cs_insn_name(this.handle, insnId) as unknown as string) || '';
    }

    close(): void {
        if (this.handle !== 0n) {
            closeHandle(this.handle);
            this.handle = 0n;
            registry.unregister(this);
        }
    }

    // Architecture types
    static readonly X86 = cs_arch.X86;
    static readonly ARM = cs_arch.ARM;
    static readonly ARM64 = cs_arch.ARM64;
    static readonly MIPS = cs_arch.MIPS;
    static readonly PPC = cs_arch.PPC;
    static readonly SPARC = cs_arch.SPARC;
    static readonly SYSZ = cs_arch.SYSZ;
    static readonly XCORE = cs_arch.XCORE;
    static readonly M68K = cs_arch.M68K;
    static readonly TMS320C64X = cs_arch.TMS320C64X;
    static readonly M680X = cs_arch.M680X;
    static readonly EVM = cs_arch.EVM;
}
