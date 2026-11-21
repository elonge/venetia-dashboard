import type { Metadata } from "next";
import type { DayData } from "@/components/daily/types";
import { isInterestingDay } from "@/components/daily/dayUtils";
import { getDailyRecordByDate } from "@/lib/daily_records";
import { getAllFunFacts } from "@/lib/fun_facts";
import HomeClient from "./HomeClient";

const SITE_URL = "https://www.thevenetiaproject.com";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/` },
};

async function getTodayInHistory(): Promise<DayData | null> {
  const today = new Date();
  const month = today.getUTCMonth() + 1;
  const day = today.getUTCDate();
  const suffix = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  for (const year of [1914, 1915, 1913, 1912]) {
    const record = await getDailyRecordByDate(`${year}-${suffix}`);
    if (record && isInterestingDay(record)) return record;
  }

  const fallbackYear = month < 7 ? 1915 : 1914;
  return getDailyRecordByDate(`${fallbackYear}-${suffix}`);
}

export default async function Home() {
  const [initialTodayInHistory, funFacts] = await Promise.all([
    getTodayInHistory().catch(() => null),
    getAllFunFacts().catch(() => []),
  ]);

  const initialFunFacts = funFacts.map(({ _id, fact }) => ({ _id, fact }));

  return (
    <HomeClient
      initialTodayInHistory={initialTodayInHistory}
      initialFunFacts={initialFunFacts}
    />
  );
}
