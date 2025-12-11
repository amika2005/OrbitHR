import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Image */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-900 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/auth/signup-bg.png" 
            alt="Team collaboration" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
             <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">O</span>
            </div>
            <span className="text-xl font-bold tracking-tight">OrbitHR</span>
          </div>
        </div>

        <div className="relative z-10">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;OrbitHR has transformed how we manage our team. The cultural fit analysis is a game-changer for hiring.&rdquo;
            </p>
            <footer className="text-sm text-gray-400">Alex Chen, CTO</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center bg-white p-4">
         <div className="w-full max-w-sm space-y-6">
           <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground text-gray-500">
              Enter your email below to create your account
            </p>
          </div>

          <div className="flex justify-center">
            <SignUp 
              fallbackRedirectUrl="/dashboard"
              signInUrl="/sign-in"
              appearance={{
                elements: {
                  formButtonPrimary: 
                    "bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-sm",
                  card: "bg-transparent shadow-none w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: 
                    "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors",
                  socialButtonsBlockButtonText: "text-gray-600 font-medium",
                  formFieldLabel: "text-gray-700 font-medium",
                  formFieldInput: 
                    "bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-zinc-300 focus:ring-zinc-300 shadow-sm",
                  footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
                  identityPreviewText: "text-gray-700",
                  identityPreviewEditButtonIcon: "text-gray-400"
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
