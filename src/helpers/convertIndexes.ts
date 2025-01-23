const FIRST_STEP_EQUEVALENCE = 500;

export default function convertIndex(index: number, zeroBased: boolean = true) {
  if (!zeroBased) {
    if (index === 0) {
      return 0;
    }

    if (index === 1) {
      return FIRST_STEP_EQUEVALENCE;
    }

    return FIRST_STEP_EQUEVALENCE * 2 ** (index - 1);
  }

  return FIRST_STEP_EQUEVALENCE * 2 ** index;
}
