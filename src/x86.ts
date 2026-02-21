import { cs_mode, x86_op_type } from './types';
import type { X86Detail, x86_reg } from './types';
import { Instruction, type RawInstruction } from './instruction';
import { Capstone } from './capstone';

export { type X86Detail };

export interface X86Op {
    type: x86_op_type;
    reg?: x86_reg;
    imm?: bigint;
    mem?: {
        segment: x86_reg;
        base: x86_reg;
        index: x86_reg;
        scale: number;
        disp: bigint;
    };
    size: number;
    access: number;
    avx_bcast: number;
    avx_zero_opmask: boolean;
}

export class InstructionX86 extends Instruction {
    declare public detail?: X86Detail;

    constructor(raw: RawInstruction) {
        super(raw);
    }
}

export class CapstoneX86 extends Capstone<InstructionX86> {
    constructor(mode: cs_mode | number | boolean = 8) { // Default to MODE_64
        // Handle old test style where true/false might have been used for mode
        const actualMode = typeof mode === 'boolean' 
            ? (mode ? 8 : 4) // 8 -> MODE_64, 4 -> MODE_32
            : mode;
        
        super(Capstone.X86, actualMode as number);
        this.onDetail();
    }

    override disasm(buffer: Buffer, address: bigint | number, count?: number): InstructionX86[] {
        const addrBig = typeof address === 'number' ? BigInt(address) : address;
        const rawInsns = super.disasm(buffer, addrBig, count);
        return rawInsns.map(insn => new InstructionX86(insn));
    }
}
