export enum cs_arch {
  ARM = 0, // ARM architecture (including Thumb, Thumb-2)
  ARM64, // ARM-64, also called AArch64
  MIPS, // Mips architecture
  X86, // X86 architecture (including x86 & x86-64)
  PPC, // PowerPC architecture
  SPARC, // Sparc architecture
  SYSZ, // SystemZ architecture
  XCORE, // XCore architecture
  M68K, // 68K architecture
  TMS320C64X, // TMS320C64x architecture
  M680X, // 680X architecture
  EVM, // Ethereum architecture
  MAX,
  ALL = 0xffff, // All architectures - for cs_support()
}
