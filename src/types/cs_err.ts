export enum cs_err {
  OK = 0, // No error: everything was fine
  MEM, // Out-Of-Memory error: cs_open(), cs_disasm(), cs_disasm_iter()
  ARCH, // Unsupported architecture: cs_open()
  HANDLE, // Invalid handle: cs_op_count(), cs_op_index()
  CSH, // Invalid csh argument: cs_close(), cs_errno(), cs_option()
  MODE, // Invalid/unsupported mode: cs_open()
  OPTION, // Invalid/unsupported option: cs_option()
  DETAIL, // Information is unavailable because detail option is OFF
  MEMSETUP, // Dynamic memory management uninitialized (see CS_OPT_MEM)
  VERSION, // Unsupported version (bindings)
  DIET, // Access irrelevant data in "diet" engine
  SKIPDATA, // Access irrelevant data for "data" instruction in SKIPDATA mode
  X86_ATT, // X86 AT&T syntax is unsupported (opt-out at compile time)
  X86_INTEL, // X86 Intel syntax is unsupported (opt-out at compile time)
  X86_MASM, // X86 Masm syntax is unsupported (opt-out at compile time)
}
