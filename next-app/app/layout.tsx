import "./globals.css";
import AppShell from "./components/Shell";

export const metadata = {
  title: "DocEng | Technical Portfolio",
  description: "Engineering Documentation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="antialiased text-[#d1d5db] bg-[#0b0c10]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
