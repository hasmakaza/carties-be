import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./nav/Navbar";
import ToastProvider from "./providers/ToastProvider";
import SignalRProvider from "./providers/SignalRProvider";
import { getCurrentUser } from "./actions/authAction";
export const metadata: Metadata = {
  title: "Carsties App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        <Navbar />
        <main className="container mx-auto pt-10">
          <SignalRProvider user={user}>{children}</SignalRProvider>
        </main>
      </body>
    </html>
  );
}
