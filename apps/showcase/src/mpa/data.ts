/**
 * Sample messaging data for the MPA demo. Hardcoded (no backend) — enough to
 * demonstrate the threads -> conversation multi-page flow.
 */

export interface Message {
  id: string;
  /** `in` = received, `out` = sent. */
  direction: 'in' | 'out';
  text: string;
  time: string;
}

export interface Thread {
  id: string;
  name: string;
  /** Short preview shown on the threads list. */
  preview: string;
  time: string;
  unread: number;
  messages: Message[];
}

export const THREADS: Thread[] = [
  {
    id: 'alex',
    name: 'Alex Rivera',
    preview: 'See you at the demo tomorrow?',
    time: '9:41',
    unread: 2,
    messages: [
      { id: 'a1', direction: 'in', text: 'Hey! Did you get a chance to look at the new build?', time: '9:12' },
      { id: 'a2', direction: 'out', text: 'Just opened it — the flip transition looks great.', time: '9:20' },
      { id: 'a3', direction: 'in', text: 'Right? It feels just like WP8.', time: '9:33' },
      { id: 'a4', direction: 'in', text: 'See you at the demo tomorrow?', time: '9:41' },
    ],
  },
  {
    id: 'maya',
    name: 'Maya Chen',
    preview: 'The app bar is pinned to the bottom now',
    time: '8:05',
    unread: 0,
    messages: [
      { id: 'm1', direction: 'in', text: 'The app bar is pinned to the bottom now.', time: '7:58' },
      { id: 'm2', direction: 'out', text: 'Nice — sticky or fixed?', time: '8:02' },
      { id: 'm3', direction: 'in', text: 'Fixed, so it stays over the content.', time: '8:05' },
    ],
  },
  {
    id: 'sam',
    name: 'Sam Okafor',
    preview: 'Can you send the tile spec?',
    time: 'Yesterday',
    unread: 1,
    messages: [
      { id: 's1', direction: 'in', text: 'Can you send the tile spec?', time: 'Yesterday' },
      { id: 's2', direction: 'out', text: 'Sure, sending it over now.', time: 'Yesterday' },
    ],
  },
  {
    id: 'jordan',
    name: 'Jordan Lee',
    preview: 'Thanks for the theme tokens!',
    time: 'Mon',
    unread: 0,
    messages: [
      { id: 'j1', direction: 'out', text: 'Thanks for the theme tokens!', time: 'Mon' },
      { id: 'j2', direction: 'in', text: 'Anytime — they map 1:1 to the XAML brushes.', time: 'Mon' },
    ],
  },
];

/** Resolve a thread by id, falling back to the first thread. */
export function findThread(id: string | null): Thread {
  const match = THREADS.find((t) => t.id === id);
  return match ?? THREADS[0];
}