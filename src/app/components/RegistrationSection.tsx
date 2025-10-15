"use client";

import { useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Home, Users, User, X } from "lucide-react";

interface Member {
  name: string;
  position: string;
}

export default function RegistrationSection() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 - House Details
  const [houseNumber, setHouseNumber] = useState("");
  const [houseName, setHouseName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [location, setLocation] = useState("");
  const [roadName, setRoadName] = useState("");
  const [address, setAddress] = useState("");

  // Step 2 - Family Members
  const [members, setMembers] = useState<Member[]>([{ name: "", position: "Son" }]);

  // Step 3 - Primary Member Details
  const [selectedMember, setSelectedMember] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [dob, setDob] = useState("");

  const addMember = () => {
    setMembers([...members, { name: "", position: "Son" }]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      const updated = [...members];
      updated.splice(index, 1);
      setMembers(updated);
    }
  };

  const handleMemberChange = (index: number, field: keyof Member, value: string) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const validateStep1 = () => {
    if (!houseNumber || !houseName || !familyName || !location || !roadName || !address) {
      alert("Please fill all fields");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (members.some(m => !m.name)) {
      alert("Please fill all member names");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!selectedMember || !phone || !whatsapp || !aadhaar || !dob) {
      alert("Please fill all primary member details");
      return;
    }

    setLoading(true);

    const data = {
      houseNumber,
      houseName,
      familyName,
      location,
      roadName,
      address,
      members,
      primaryMember: {
        name: selectedMember,
        phone,
        whatsapp,
        aadhaar,
        dob,
      },
      totalMembers: members.length,
      createdAt: new Date().toISOString(),
      registrationDate: new Date().toLocaleDateString(),
    };

    try {
      const docRef = await addDoc(collection(db, "families"), data);
      console.log("Document written with ID:", docRef.id);
      alert("Registration successful! Your family has been registered.");
      
      // Reset form
      setStep(1);
      setHouseNumber("");
      setHouseName("");
      setFamilyName("");
      setLocation("");
      setRoadName("");
      setAddress("");
      setMembers([{ name: "", position: "Son" }]);
      setSelectedMember("");
      setPhone("");
      setWhatsapp("");
      setAadhaar("");
      setDob("");
      
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Family Registration
          </h1>
          <p className="text-center text-gray-600 mb-8">Step {step} of 3</p>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    s <= step
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                      : "bg-gray-200"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Step 1: House Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Home className="w-5 h-5 mr-2 text-emerald-600" />
                House Information
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House Number *
                </label>
                <input
                  type="text"
                  placeholder="Enter house number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter house name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={houseName}
                  onChange={(e) => setHouseName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter family name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  placeholder="Enter location"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Road Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter road name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={roadName}
                  onChange={(e) => setRoadName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Address *
                </label>
                <textarea
                  placeholder="Enter complete address"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <button
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Next Step
              </button>
            </div>
          )}

          {/* Step 2: Family Members */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-emerald-600" />
                Family Members
              </h2>

              <div className="space-y-3">
                {members.map((m, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <input
                        placeholder="Member Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                        value={m.name}
                        onChange={(e) => handleMemberChange(i, "name", e.target.value)}
                      />
                    </div>
                    <div className="w-40">
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                        value={m.position}
                        onChange={(e) => handleMemberChange(i, "position", e.target.value)}
                      >
                        <option>Father</option>
                        <option>Mother</option>
                        <option>Son</option>
                        <option>Daughter</option>
                        <option>Wife</option>
                        <option>Other</option>
                      </select>
                    </div>
                    {members.length > 1 && (
                      <button
                        onClick={() => removeMember(i)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addMember}
                className="w-full py-3 border-2 border-dashed border-emerald-300 text-emerald-600 rounded-lg hover:bg-emerald-50 transition font-medium"
              >
                + Add Member
              </button>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Primary Member Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-emerald-600" />
                Primary Member Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Primary Member *
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                >
                  <option value="">Choose a member</option>
                  {members.map((m, i) => (
                    <option key={i} value={m.name}>
                      {m.name} ({m.position})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Number *
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012"
                  maxLength={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Complete Registration"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}