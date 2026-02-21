export enum cs_opt_value {
  OFF = 0, // Turn OFF an option - default for CS_OPT_DETAIL, CS_OPT_SKIPDATA, CS_OPT_UNSIGNED.
  ON = 3, // Turn ON an option (CS_OPT_DETAIL, CS_OPT_SKIPDATA).
  SYNTAX_DEFAULT = 0, // Default asm syntax (CS_OPT_SYNTAX).
  SYNTAX_INTEL, // X86 Intel asm syntax - default on X86 (CS_OPT_SYNTAX).
  SYNTAX_ATT, // X86 ATT asm syntax (CS_OPT_SYNTAX).
  SYNTAX_NOREGNAME, // Prints register name with only number (CS_OPT_SYNTAX)
  SYNTAX_MASM, // X86 Intel Masm syntax (CS_OPT_SYNTAX).
}
