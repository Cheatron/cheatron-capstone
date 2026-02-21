export enum x86_avx_bcast {
  INVALID = 0, // Uninitialized.
  BCAST2, // AVX512 broadcast type {1to2}
  BCAST4, // AVX512 broadcast type {1to4}
  BCAST8, // AVX512 broadcast type {1to8}
  BCAST16, // AVX512 broadcast type {1to16}
}
