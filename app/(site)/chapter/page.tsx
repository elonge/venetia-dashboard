import { Metadata } from 'next';
import { getChapterByChapterId } from '@/lib/chapters';
import ChapterView from '@/components/chapter/ChapterView';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const chapter_id = searchParams.chapter_id;
  const id = Array.isArray(chapter_id) ? chapter_id[0] : chapter_id;
  
  if (!id) return { title: 'Chapter Not Found | The Venetia Project' };
  
  const chapter = await getChapterByChapterId(id);
  
  if (!chapter) return { title: 'Chapter Not Found | The Venetia Project' };
  
  return {
    title: `${chapter.chapter_title} | The Venetia Project`,
    description: chapter.main_story ? (chapter.main_story.substring(0, 160) + '...') : 'A chapter from the Venetia Project.',
    openGraph: {
      title: chapter.chapter_title,
      description: chapter.main_story ? (chapter.main_story.substring(0, 160) + '...') : undefined,
    }
  };
}

export default async function ChapterPage(props: Props) {
  const searchParams = await props.searchParams;
  const chapter_id = searchParams.chapter_id;
  const id = Array.isArray(chapter_id) ? chapter_id[0] : chapter_id;

  if (!id) {
    return <ChapterView chapterData={null as any} />;
  }

  const chapter = await getChapterByChapterId(id);

  // We pass the chapter data to the client component. 
  // Note: The client component also merges podcast info from constants.
  return <ChapterView chapterData={chapter as any} />;
}
