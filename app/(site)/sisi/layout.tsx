import { SisiChatVisibility } from "./SisiChatVisibility";

export default function SisiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SisiChatVisibility />
      {children}
    </>
  );
}
