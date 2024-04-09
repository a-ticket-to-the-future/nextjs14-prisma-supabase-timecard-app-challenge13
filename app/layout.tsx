import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthContext from "./context/AuthContext";
import Navigation from "./components/navigation/Navigation";
import getCurrentUser from "./actions/getCurrentUser";
// import { Toaster } from "react-hot-toast";
import SignupModal from "./components/modals/SignupModal";
import LoginModal from "./components/modals/LoginModal";
import ProfileModal from "./components/modals/ProfileModal";
import ToasterContext from "./context/ToasterContext";
import OnScanModal from "./components/modals/OnScanModal";

// type setWorkingStateProps = {
//   setWorkingProps = (state:boolean) => void
// }

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "nextjs14-prisma-supabase-timecard-app-challenge",
  description: "nextjs14-prisma-supabase-timecard-app-challenge",
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const currentUser = await getCurrentUser();

  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthContext>
          {/* Toaster */}
          <ToasterContext />
          {/* モーダル */}
          <SignupModal />
          <LoginModal />
          <ProfileModal currentUser={currentUser} />
          {/* <OnScanModal setWorkingState={setWorkingState} /> */}

          <div className=" flex min-h-screen flex-col">
            <Navigation currentUser={currentUser} />
              <main className=" container mx-auto max-w-screen-sm flex-1 px-1 py-5">
                {children}
              </main>
                  <footer className='py-5'>
                    <div className='text-center text-sm'>
                      nextjs14-prisma-supabase-timecard-app-challenge
                    </div>
                  </footer>
            </div>
        </AuthContext>
      </body>
    </html>
  );
}
