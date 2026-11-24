// The site reads like a book: every section is a numbered chapter.
// `kanji` is the chapter number in Japanese (第N章), used as a decorative label.

export const chapters = [
  { id: 'home', no: '01', kanji: '第一章', label: 'Cover', nav: null },
  { id: 'work', no: '02', kanji: '第二章', label: 'Selected work', nav: 'Work' },
  { id: 'stack', no: '03', kanji: '第三章', label: 'The stack', nav: 'Stack' },
  { id: 'about', no: '04', kanji: '第四章', label: 'The author', nav: 'About' },
  { id: 'experience', no: '05', kanji: '第五章', label: 'Experience', nav: 'Experience' },
  { id: 'receipts', no: '06', kanji: '第六章', label: 'The receipts', nav: 'Receipts' },
  { id: 'bring', no: '07', kanji: '第七章', label: 'What I bring', nav: null },
  { id: 'contact', no: '08', kanji: '第八章', label: 'Contact', nav: 'Contact' },
]

export const chapterById = Object.fromEntries(chapters.map((c) => [c.id, c]))
export const TOTAL = String(chapters.length).padStart(2, '0')
