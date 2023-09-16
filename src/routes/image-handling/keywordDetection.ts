// Returns true if the predictions parameter contains any of the strings
// defined in fireDamageKeywords. Returns false otherwise.
export function hasFireDamageKeywords(predictions: string[]): boolean {
  const fireDamageKeywords = [
    'fire',
    'burned',
    'fire damage',
  ];
  return predictions.some(
      (prediction: string) => fireDamageKeywords.indexOf(prediction) > -1,
  );
}

// Returns true if the predictions parameter contains any of the strings
// defined in glassDamageKeywords. Returns false otherwise.
export function hasGlassDamageKeywords(predictions: string[]): boolean {
  const glassDamageKeywords = [
    'broken window',
    'broken glass',
    'broken windows',
  ];
  return predictions.some(
      (prediction: string) => glassDamageKeywords.indexOf(prediction) > -1,
  );
}

// Returns true if the predictions parameter contains any of the strings
// defined in panelDamageKeywords. Returns false otherwise.
export function hasPanelDamageKeywords(predictions: string[]): boolean {
  const panelDamageKeywords = [
    'smashed',
    'broken',
  ];
  return predictions.some(
      (prediction: string) => panelDamageKeywords.indexOf(prediction) > -1,
  );
}
