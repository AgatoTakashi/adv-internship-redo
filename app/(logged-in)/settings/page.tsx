"use client";

export default function SettingsPage() {
  return (
    <div className="max-w-[1070px] mx-auto px-8 py-10 space-y-12">
      {/* Page Title */}
      <h1 className="text-[32px] font-semibold text-[#032b41] border-b border-gray-300 pb-[20px]">
        Settings
      </h1>

      {/* Subscription Plan Section */}
      <div className="space-y-2 border-b border-gray-300 pb-[20px]">
        <h2 className="text-[20px] font-semibold text-[#032b41]">
          Your Subscription plan
        </h2>

        <p className="text-[16px] text-[#032b41]">
          Basic
        </p>

        <button
          className="
            mt-4
            bg-[#032b41]
            text-white
            px-6 py-2
            rounded-md
            text-[16px]
            font-medium
          "
        >
          Upgrade to Premium
        </button>
      </div>

      {/* Email Section */}
      <div className="space-y-2">
        <h2 className="text-[20px] font-semibold text-[#032b41]">
          Email
        </h2>

        <p className="text-[16px] text-[#032b41]">
          hueytest@hueytest.com
        </p>
      </div>
    </div>
  );
}
