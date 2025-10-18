"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { User, Home, LogIn } from "lucide-react";

export default function LoginSection() {
  const router = useRouter();
  const [houseNumber, setHouseNumber] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!houseNumber || !dob) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // Query Firestore for matching credentials
      const q = query(
        collection(db, "families"),
        where("houseNumber", "==", houseNumber),
        where("primaryMember.dob", "==", dob)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Invalid credentials! Please check your House Number and Date of Birth.");
        setLoading(false);
        return;
      }

      // Login successful - get family data
      const familyDoc = querySnapshot.docs[0];
      const familyData = { id: familyDoc.id, ...familyDoc.data() };

      // Store in sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("familyData", JSON.stringify(familyData));
        sessionStorage.setItem("isLoggedIn", "true");
      }

      console.log("Login successful:", familyData);
      
      // Navigate to dashboard
      router.push("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
      setError("Error during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Login to access your family dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              House Number *
            </label>
            <input
              type="text"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="Enter your house number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the date of birth of the primary member
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Login
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-emerald-600 font-semibold hover:underline">
              Register here
            </a>
          </p>
        </div>

        <div className="mt-4 text-center">
          <a href="/" className="text-gray-500 hover:text-gray-700 text-sm inline-flex items-center">
            <Home className="w-4 h-4 mr-1" />
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}