// Returns true if the text parameter contains any of the strings defined in
// affirmativeKeywords. Returns false otherwise.
export function isAffirmative(text: string): boolean {
  const affirmativeKeywords = [
    'policy covers',
    'is covered',
    'yes',
  ];
  return affirmativeKeywords.some(
      (word) => text.trim().toLowerCase().indexOf(word) > -1,
  );
};
