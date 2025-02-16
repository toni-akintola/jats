import { HeaderProvider } from "@/contexts/header-context";
import { Header } from "@/components/header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative pt-16">
      <HeaderProvider>
        <Header />
        {children}
      </HeaderProvider>
    </div>
  );
}
