// ------------------------------------
// Sort-by columns
// ------------------------------------
export const CREATED_DATE = 'CREATED_DATE';
export const NOTE_TITLE = 'NOTE_TITLE';

const sortNotes = {
  [CREATED_DATE]: (a, b) => {
    const aDate = a.date;
    const bDate = b.date;

    return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
  },
  [NOTE_TITLE]: (a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1)
}

export function applyNotesSort(notes, column, reverse) {
  if (notes && notes.length && notes.sort) {
    const sortedNotes = notes.sort(sortNotes[column]);
    return reverse ? sortedNotes.reverse() : sortedNotes;
  }
  return [];
}

export default {
  applyNotesSort
}
