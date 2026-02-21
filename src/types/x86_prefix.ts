export enum x86_prefix {
  LOCK = 0xf0, // lock (cs_x86.prefix[0]
  REP = 0xf3, // rep (cs_x86.prefix[0]
  REPE = 0xf3, // repe/repz (cs_x86.prefix[0]
  REPNE = 0xf2, // repne/repnz (cs_x86.prefix[0]
  CS = 0x2e, // segment override CS (cs_x86.prefix[1]
  SS = 0x36, // segment override SS (cs_x86.prefix[1]
  DS = 0x3e, // segment override DS (cs_x86.prefix[1]
  ES = 0x26, // segment override ES (cs_x86.prefix[1]
  FS = 0x64, // segment override FS (cs_x86.prefix[1]
  GS = 0x65, // segment override GS (cs_x86.prefix[1]
  OPSIZE = 0x66, // operand-size override (cs_x86.prefix[2]
  ADDRSIZE = 0x67, // address-size override (cs_x86.prefix[3]
}
