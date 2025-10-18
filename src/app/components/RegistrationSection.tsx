"use client";

import { useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Home, Users, User, X, CheckCircle, Edit, Check } from "lucide-react";

interface Member {
  name: string;
  position: string;
}

export default function RegistrationSection() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
    setShowSuccessPopup(false);
  };

  const formatAadhaar = (value: string) => {
    return value.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-4">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Masjid Family Registration
            </h1>
            <p className="text-gray-600">Step {step} of 4</p>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
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
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <Home className="w-5 h-5 mr-2 text-emerald-600" />
                House Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    House Number *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 123"
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
                    placeholder="e.g., Al-Noor Villa"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    value={houseName}
                    onChange={(e) => setHouseName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Rahman Family"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Kanayannur"
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
                    placeholder="e.g., Main Road"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    value={roadName}
                    onChange={(e) => setRoadName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Address *
                </label>
                <textarea
                  placeholder="Enter complete postal address"
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
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-[1.02]"
              >
                Continue to Family Members
              </button>
            </div>
          )}

          {/* Step 2: Family Members */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <Users className="w-5 h-5 mr-2 text-emerald-600" />
                Family Members
              </h2>

              <div className="space-y-3">
                {members.map((m, i) => (
                  <div key={i} className="flex gap-2 items-start p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <input
                        placeholder="Member Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-white"
                        value={m.name}
                        onChange={(e) => handleMemberChange(i, "name", e.target.value)}
                      />
                    </div>
                    <div className="w-32 sm:w-40">
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-white"
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
                + Add Another Member
              </button>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-[1.02]"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Primary Member Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <User className="w-5 h-5 mr-2 text-emerald-600" />
                Primary Contact Details
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

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
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
                    maxLength={10}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
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
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (!selectedMember || !phone || !whatsapp || !aadhaar || !dob) {
                      alert("Please fill all primary member details");
                      return;
                    }
                    setStep(4);
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-[1.02]"
                >
                  Review Details
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Confirm */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center text-gray-800">
                  <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
                  Review Your Information
                </h2>
              </div>

              {/* House Details Review */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <Home className="w-4 h-4 mr-2 text-emerald-600" />
                    House Information
                  </h3>
                  <button
                    onClick={() => setStep(1)}
                    className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm font-medium"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">House Number</p>
                    <p className="font-medium text-gray-900">{houseNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">House Name</p>
                    <p className="font-medium text-gray-900">{houseName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Family Name</p>
                    <p className="font-medium text-gray-900">{familyName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{location}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Road Name</p>
                    <p className="font-medium text-gray-900">{roadName}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Address</p>
                    <p className="font-medium text-gray-900">{address}</p>
                  </div>
                </div>
              </div>

              {/* Family Members Review */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    Family Members ({members.length})
                  </h3>
                  <button
                    onClick={() => setStep(2)}
                    className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
                <div className="space-y-2">
                  {members.map((m, i) => (
                    <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <span className="font-medium text-gray-900">{m.name}</span>
                      <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {m.position}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Member Review */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <User className="w-4 h-4 mr-2 text-purple-600" />
                    Primary Contact
                  </h3>
                  <button
                    onClick={() => setStep(3)}
                    className="text-purple-600 hover:text-purple-700 flex items-center text-sm font-medium"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{selectedMember}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date of Birth</p>
                    <p className="font-medium text-gray-900">{dob}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">WhatsApp</p>
                    <p className="font-medium text-gray-900">{whatsapp}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Aadhaar Number</p>
                    <p className="font-medium text-gray-900">{formatAadhaar(aadhaar)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <p className="flex items-start">
                  <Check className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  Please review all information carefully. Once submitted, you may need to contact the administrator to make changes.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 transform hover:scale-[1.02]"
                >
                  {loading ? "Submitting..." : "Confirm & Submit"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform animate-[scale-in_0.3s_ease-out]">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Registration Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              JazakAllah Khair! Your family has been successfully registered with the Masjid.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-emerald-800">
                <strong>Family:</strong> {familyName}
              </p>
              <p className="text-sm text-emerald-800">
                <strong>Members:</strong> {members.length} family members
              </p>
              <p className="text-sm text-emerald-800">
                <strong>Contact:</strong> {selectedMember}
              </p>
            </div>
            <button
              onClick={resetForm}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center transform hover:scale-[1.02]"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}