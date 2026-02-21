export enum cs_opt_type {
  INVALID = 0, // No option specified
  SYNTAX, // Assembly output syntax
  DETAIL, // Break down instruction structure into details
  MODE, // Change engine's mode at run-time
  MEM, // User-defined dynamic memory related functions
  SKIPDATA, // Skip data when disassembling. Then engine is in SKIPDATA mode.
  SKIPDATA_SETUP, // Setup user-defined function for SKIPDATA option
  MNEMONIC, // Customize instruction mnemonic
  UNSIGNED, // print immediate operands in unsigned form
}
