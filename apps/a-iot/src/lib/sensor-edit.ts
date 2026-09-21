/** An absent server height is displayed as zero; blank drafts cannot be saved. */
export function getHeightEditState(draft: string, original: number | null | undefined) {
  const height = Number(draft)
  const valid = draft.trim() !== '' && Number.isFinite(height)
  return { height, valid, changed: valid && height !== (original ?? 0) }
}
