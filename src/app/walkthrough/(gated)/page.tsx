import type { Metadata } from 'next';
import { Story } from 'src/walkthrough/story/Story';

export const metadata: Metadata = { title: 'Story mode' };

export default function StoryPage() {
  return <Story />;
}
