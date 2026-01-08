import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Header } from "@/components/dashboard/Header";
import { syncUser } from "@/lib/auth-sync";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Ensure user exists in DB
  try {
    await syncUser();
  } catch (error: any) {
    // If it's a redirect error, rethrow it so Next.js handles the redirect
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    
    console.error("Sync User Error:", error);
    
    // safe fallback UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
           <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
           </div>
           <h2 className="text-xl font-semibold text-center text-zinc-900 dark:text-white mb-2">
             Account Sync Failed
           </h2>
           <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center mb-6">
             We couldn't synchronize your account information. This might be due to a temporary database issue or missing email.
           </p>
           <div className="bg-zinc-100 dark:bg-zinc-800 rounded p-3 text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-6 overflow-auto max-h-20">
             {error.message || "Unknown error"}
           </div>
           <div className="flex gap-3 justify-center">
              <a href="/dashboard" className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-md text-sm font-medium hover:bg-zinc-800 hover:dark:bg-zinc-200 transition-colors">
                Retry
              </a>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-6 bg-zinc-50 dark:bg-zinc-950">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}