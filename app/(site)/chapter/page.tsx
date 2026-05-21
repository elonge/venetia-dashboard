import { getChapterByChapterId } from '@/lib/chapters';
import { notFound, permanentRedirect } from 'next/navigation';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LegacyChapterPage(props: Props) {
  const searchParams = await props.searchParams;
  const chapter_id = searchParams.chapter_id;
  const id = Array.isArray(chapter_id) ? chapter_id[0] : chapter_id;

  if (!id) {
    notFound();
  }

  const chapter = await getChapterByChapterId(id);
  if (!chapter) {
    notFound();
  }

  permanentRedirect(`/chapter/${encodeURIComponent(chapter.slug)}`);
}
