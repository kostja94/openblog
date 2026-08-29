import { resolveBlogChrome } from "@/chrome/resolve-chrome";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { Header, Footer } = await resolveBlogChrome();

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
