import { describe, it, expect } from 'bun:test';
import { CapstoneX86, x86_op_type, x86_insn, x86_reg } from '../src';

describe('Capstone X86 Disassembly', () => {
  it('should disassemble x86_64 instructions accurately using CapstoneX86 class', () => {
    const code = Buffer.from([0x55, 0x48, 0x8b, 0x05, 0xb8, 0x13, 0x00, 0x00]);
    const address = 0x1000n;

    const cs = new CapstoneX86(); //\
    //  Defaults to 64-bit
    cs.onDetail();

    const insns = cs.disasm(code, address);

    expect(insns.length).toBe(2);
    expect(insns.length).toBeGreaterThan(0);

    // First instruction: push rbp
    // Check first instruction
    expect(insns[0].mnemonic).toBe('push');
    expect(insns[0].op_str).toBe('rbp');
    expect(insns[0].id).toBe(x86_insn.PUSH);

    // Second instruction: mov rax, qword ptr [rip + 0x13b8]
    expect(insns[1].id).toBe(x86_insn.MOV);
    expect(insns[1].mnemonic).toBe('mov');
    expect(insns[1].op_str).toBe('rax, qword ptr [rip + 0x13b8]');
    const x86 = insns[1].detail?.x86;
    expect(x86).toBeDefined();

    // Manual close test (FinalizationRegistry also handles it)
    cs.close();
  });

  it('should provide detailed X86 information including operands', () => {
    const code = Buffer.from([0x48, 0x8b, 0x05, 0xb8, 0x13, 0x00, 0x00]); // mov rax, qword ptr [rip + 0x13b8]
    const cs = new CapstoneX86();
    cs.onDetail();

    const insns = cs.disasm(code, 0x1000n);
    expect(insns.length).toBe(1);

    const detail = insns[0].detail;
    expect(detail).toBeDefined();
    if (detail) {
      expect(detail.x86).toBeDefined();
      const x86 = detail.x86!;

      // Check operands
      expect(x86.op_count).toBe(2);

      // First operand: RAX (reg)
      expect(x86.operands[0].type).toBe(x86_op_type.REG);
      expect(x86.operands[0].reg).toBeDefined();

      // Second operand: [RIP + 0x13b8] (mem)
      expect(x86.operands[1].type).toBe(x86_op_type.MEM);
      expect(x86.operands[1].mem).toBeDefined();
      expect(x86.operands[1].mem?.base).toBeDefined();
    }

    cs.close();
  });

  it('should handle invalid instructions gracefully', () => {
    const code = Buffer.from([0xff, 0xff, 0xff, 0xff]);
    const cs = new CapstoneX86(false);

    const insns = cs.disasm(code, 0x1000n);
    expect(Array.isArray(insns)).toBe(true);

    cs.close();
  });

  it('should support static version info', () => {
    const version = CapstoneX86.version();
    expect(version.major).toBeGreaterThan(0);
    expect(typeof version.minor).toBe('number');
    expect(version.major).toEqual(4);
    expect(version.minor).toEqual(0);
  });

  it('should resolve register names with regName', () => {
    const cs = new CapstoneX86();

    expect(cs.regName(x86_reg.RAX)).toBe('rax');
    expect(cs.regName(x86_reg.RBP)).toBe('rbp');
    expect(cs.regName(x86_reg.RSP)).toBe('rsp');
    expect(cs.regName(x86_reg.RIP)).toBe('rip');
    expect(cs.regName(x86_reg.EAX)).toBe('eax');
    expect(cs.regName(x86_reg.AL)).toBe('al');
    expect(cs.regName(x86_reg.XMM0)).toBe('xmm0');

    cs.close();
  });

  it('should resolve instruction names with insnName', () => {
    const cs = new CapstoneX86();

    expect(cs.insnName(x86_insn.MOV)).toBe('mov');
    expect(cs.insnName(x86_insn.PUSH)).toBe('push');
    expect(cs.insnName(x86_insn.POP)).toBe('pop');
    expect(cs.insnName(x86_insn.CALL)).toBe('call');
    expect(cs.insnName(x86_insn.RET)).toBe('ret');
    expect(cs.insnName(x86_insn.NOP)).toBe('nop');
    expect(cs.insnName(x86_insn.ADD)).toBe('add');
    expect(cs.insnName(x86_insn.SUB)).toBe('sub');
    expect(cs.insnName(x86_insn.XOR)).toBe('xor');
    expect(cs.insnName(x86_insn.JMP)).toBe('jmp');

    cs.close();
  });
});
