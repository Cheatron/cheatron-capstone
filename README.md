# @cheatron/capstone

TypeScript/FFI bindings for the [Capstone](http://www.capstone-engine.org/) disassembly engine with full OOP support.

## Features

- **Full Capstone API** — `cs_open`, `cs_disasm`, `cs_close`, `cs_option` and more
- **OOP Wrapper** — `Capstone` base class and `CapstoneX86` for x86/x64
- **Type-safe Enums** — Auto-generated from `capstone.h` (`cs_arch`, `cs_mode`, `cs_err`, `x86_insn`, `x86_reg`, etc.)
- **Instruction Class** — Rich `Instruction` with helpers: `isCall`, `isJump`, `isRet`, `isNop`, `isMov`, `isBranch` and more
- **Auto Cleanup** — `FinalizationRegistry` + explicit `close()` for deterministic resource management
- **Dynamic DLL Resolution** — `capstone.dll` bundled in `deps/`, resolved via `import.meta.url`

## Install

```bash
bun add @cheatron/capstone
```

## Usage

```typescript
import { CapstoneX86, x86_insn } from '@cheatron/capstone';

const cs = new CapstoneX86(true); // true = 64-bit mode

const code = Buffer.from([0x55, 0x48, 0x89, 0xe5, 0x90, 0xc3]);
const insns = cs.disasm(code, 0x1000n);

for (const insn of insns) {
  console.log(`${insn.address.toString(16)}: ${insn}`);
  // 1000: push rbp
  // 1001: mov rbp, rsp
  // 1004: nop
  // 1005: ret

  if (insn.isRet) console.log('Found return!');
  if (insn.id === x86_insn.NOP) console.log('NOP sled');
}

cs.close();
```

## License

MIT
