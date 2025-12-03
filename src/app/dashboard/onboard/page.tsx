export default function OnboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Employee Onboarding
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Streamline your employee onboarding process
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Onboarding Module Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create onboarding checklists, assign tasks, and track new hire progress all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
