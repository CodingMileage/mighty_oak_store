import { ConfettiSideCannons } from "@/components/ConfettiB";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Trigger Confetti Cannons */}
      <ConfettiSideCannons />

      {/* Success Message */}
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Success!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Your purchase was completed successfully.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md text-lg"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  );
}
