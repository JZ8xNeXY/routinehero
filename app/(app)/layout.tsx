import BGMPlayer from "@/components/BGMPlayer";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <BGMPlayer />
    </>
  );
}
