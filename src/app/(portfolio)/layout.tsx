import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Portfolio",
  description: "Web Developer Portfolio",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
