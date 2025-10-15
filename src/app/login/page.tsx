"use client";

import { useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function LoginPage() {
  const [houseNumber, setHouseNumber] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async () => {
    setError("");
    setSuccess(false);

    if (!houseNumber || !dob) {
      setError("Please enter both House Number and Date of Birth.");
      return;
    }

    try {
      setLoading(true);

      // Search Firestore for this house number and DOB
      const familiesRef = collection(db, "families");
      const q = query(familiesRef, where("houseNumber", "==", houseNumber));
      const querySnapshot = await getDocs(q);

      let matchFound = false;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.dob === dob) {
          matchFound = true;
        }
      });

      if (matchFound) {
        setSuccess(true);
        console.log("Login successful!");
      } else {
        setError("Invalid House Number or Date of Birth.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

      <div className="space-y-3">
        <input
          placeholder="House Number"
          className="input"
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
        />
        <label className="text-gray-600 text-sm">Date of Birth</label>
        <input
          type="date"
          className="input"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm font-medium">
            ✅ Login successful!
          </p>
        )}

        <button
          onClick={handleLogin}
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Checking..." : "Login"}
        </button>
      </div>
    </div>
  );
}
