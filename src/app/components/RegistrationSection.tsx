
      "use client";

import { useState, useRef } from "react";
import { Home, Users, User, Camera, CheckCircle, Edit2, X, Upload } from "lucide-react";

interface Member {
name: string;
position: string;
}

interface CropArea {
x: number;
y: number;
width: number;
height: number;
}

export default function RegistrationSection() {
const [step, setStep] = useState(1);
const [loading, setLoading] = useState(false);
const [showSuccessModal, setShowSuccessModal] = useState(false);

const handleGoHome = () => {
setShowSuccessModal(false);
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
setPhoto("");
// Navigate to home - you can replace with your router navigation
window.location.href = "/";
};

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
const [photo, setPhoto] = useState("");
const [showCrop, setShowCrop] = useState(false);
const [tempPhoto, setTempPhoto] = useState("");

const fileInputRef = useRef<HTMLInputElement>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);

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

const validateStep3 = () => {
if (!selectedMember || !phone || !whatsapp || !aadhaar || !dob || !photo) {
alert("Please fill all primary member details including photo");
return false;
}
return true;
};

const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (file) {
const reader = new FileReader();
reader.onload = (event) => {
setTempPhoto(event.target?.result as string);
setShowCrop(true);
};
reader.readAsDataURL(file);
}
};

const handleCropComplete = () => {
const canvas = canvasRef.current;
const img = new Image();
img.onload = () => {
if (canvas) {
const ctx = canvas.getContext("2d");
const aspectRatio = 3 / 4;

let cropWidth = img.width;
let cropHeight = img.width / aspectRatio;

if (cropHeight > img.height) {
cropHeight = img.height;
cropWidth = img.height * aspectRatio;
}

const startX = (img.width - cropWidth) / 2;
const startY = (img.height - cropHeight) / 2;

canvas.width = 300;
canvas.height = 400;

ctx?.drawImage(
img,
startX,
startY,
cropWidth,
cropHeight,
0,
0,
300,
400
);

const croppedImage = canvas.toDataURL("image/jpeg", 0.8);
setPhoto(croppedImage);
setShowCrop(false);
setTempPhoto("");
}
};
img.src = tempPhoto;
};

const handleEditStep = (stepNumber: number) => {
setStep(stepNumber);
};

const handleFinalSubmit = async () => {
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
photo,
},
totalMembers: members.length,
createdAt: new Date().toISOString(),
registrationDate: new Date().toLocaleDateString(),
};

try {
// Simulate API call - replace with actual Firebase call
await new Promise(resolve => setTimeout(resolve, 1500));
console.log("Submitting data:", data);

setShowSuccessModal(true);

} catch (error) {
console.error("Error saving data:", error);
alert("Error saving data! Please try again.");
} finally {
setLoading(false);
}
};

return (
<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
<div className="max-w-2xl mx-auto">
{/* Header */}
<div className="text-center mb-6 sm:mb-8">
<div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full mb-3 sm:mb-4 shadow-lg">
  <Home className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
</div>
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent px-4">
  Masjid Family Registration
</h1>
<p className="text-sm sm:text-base text-gray-600">Complete the form to register your family</p>
</div>

<div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
<p className="text-center text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Step {step} of 4</p>

{/* Progress Bar */}
<div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8">
  {[1, 2, 3, 4].map((s) => (
    <div key={s} className="flex-1">
      <div
        className={`h-1.5 sm:h-2 rounded-full transition-all ${
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
    <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center">
      <Home className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-emerald-600" />
      House Information
    </h2>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          House Number *
        </label>
        <input
          type="text"
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
          placeholder="e.g., Al-Barakah"
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
        placeholder="Enter family name"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
        value={familyName}
        onChange={(e) => setFamilyName(e.target.value)}
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location *
        </label>
        <input
          type="text"
          placeholder="Area/Locality"
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
          placeholder="Street/Road"
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
        placeholder="Enter complete address with landmarks"
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
    <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center">
      <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-emerald-600" />
      Family Members
    </h2>

    <div className="space-y-3">
      {members.map((m, i) => (
        <div key={i} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-start p-3 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <input
              placeholder="Member Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              value={m.name}
              onChange={(e) => handleMemberChange(i, "name", e.target.value)}
            />
          </div>
          <div className="w-full sm:w-40">
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
              className="w-full sm:w-auto p-3 text-red-500 hover:bg-red-100 rounded-lg transition"
            >
              <X className="w-5 h-5 mx-auto sm:mx-0" />
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
        className="flex-1 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
      >
        Back
      </button>
      <button
        onClick={() => {
          if (validateStep2()) setStep(3);
        }}
        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-[1.02]"
      >
        Continue to Primary Member
      </button>
    </div>
  </div>
)}

{/* Step 3: Primary Member Details */}
{step === 3 && (
  <div className="space-y-4">
    <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center">
      <User className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-emerald-600" />
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

    {/* Photo Upload Section */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Photo *
      </label>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {photo ? (
          <div className="relative">
            <img
              src={photo}
              alt="Member"
              className="w-24 h-32 sm:w-32 sm:h-40 object-cover rounded-lg border-2 border-emerald-500 shadow-md"
            />
            <button
              onClick={() => setPhoto("")}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-32 sm:w-32 sm:h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
        )}
        
        <div className="flex-1 w-full">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-3 bg-emerald-50 border-2 border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-100 transition font-medium flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            {photo ? "Change Photo" : "Upload Photo"}
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">
            Photo will be cropped to 3:4 ratio (passport size)
          </p>
        </div>
      </div>
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

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        className="flex-1 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
      >
        Back
      </button>
      <button
        onClick={() => {
          if (validateStep3()) setStep(4);
        }}
        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-[1.02]"
      >
        Review & Submit
      </button>
    </div>
  </div>
)}

{/* Step 4: Review & Confirmation */}
{step === 4 && (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold mb-6 flex items-center">
      <CheckCircle className="w-6 h-6 mr-3 text-emerald-600" />
      Review Your Information
    </h2>

    {/* House Details */}
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-emerald-800 flex items-center">
          <Home className="w-5 h-5 mr-2" />
          House Information
        </h3>
        <button
          onClick={() => handleEditStep(1)}
          className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-sm"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
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

    {/* Family Members */}
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-blue-800 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Family Members ({members.length})
        </h3>
        <button
          onClick={() => handleEditStep(2)}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
      </div>
      <div className="space-y-2">
        {members.map((m, i) => (
          <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg">
            <span className="font-medium text-gray-900">{m.name}</span>
            <span className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full">
              {m.position}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Primary Member */}
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-purple-800 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Primary Member Details
        </h3>
        <button
          onClick={() => handleEditStep(3)}
          className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
      </div>
      <div className="flex gap-6">
        <img
          src={photo}
          alt="Member"
          className="w-32 h-40 object-cover rounded-lg border-2 border-purple-300 shadow-md"
        />
        <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
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
            <p className="font-medium text-gray-900">{aadhaar}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="flex gap-4 pt-4">
      <button
        onClick={() => setStep(3)}
        className="flex-1 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
      >
        Back
      </button>
      <button
        onClick={handleFinalSubmit}
        disabled={loading}
        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Submitting...
          </span>
        ) : (
          "Confirm & Submit Registration"
        )}
      </button>
    </div>
  </div>
)}
</div>
</div>

{/* Photo Crop Modal */}
{showCrop && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-2xl p-6 max-w-md w-full">
  <h3 className="text-xl font-semibold mb-4 text-center">Crop Photo</h3>
  <div className="mb-4">
    <div className="relative inline-block">
      <img
        src={tempPhoto}
        alt="Crop preview"
        className="max-w-full h-auto rounded-lg"
      />
      <div className="absolute inset-0 border-4 border-emerald-500 rounded-lg pointer-events-none"></div>
    </div>
    <p className="text-sm text-gray-600 mt-2 text-center">
      Photo will be automatically cropped to 3:4 ratio
    </p>
  </div>
  <canvas ref={canvasRef} className="hidden" />
  <div className="flex gap-3">
    <button
      onClick={() => {
        setShowCrop(false);
        setTempPhoto("");
      }}
      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
    >
      Cancel
    </button>
    <button
      onClick={handleCropComplete}
      className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
    >
      Apply Crop
    </button>
  </div>
</div>
</div>
)}

{/* Success Modal */}
{showSuccessModal && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
<div className="bg-white rounded-2xl p-8 max-w-md w-full text-center transform animate-scaleIn">
  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-6 animate-bounce">
    <CheckCircle className="w-12 h-12 text-white" />
  </div>
  <h2 className="text-3xl font-bold text-gray-900 mb-3">
    Registration Successful!
  </h2>
  <p className="text-gray-600 mb-6">
    Alhamdulillah! Your family has been successfully registered with the Masjid.
  </p>
  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
    <p className="text-sm text-emerald-800 font-medium">
      Family: {familyName}
    </p>
    <p className="text-sm text-gray-600 mt-1">
      Total Members: {members.length}
    </p>
  </div>
</div>
</div>
)}

<style>{`
@keyframes fadeIn {
from {
  opacity: 0;
}
to {
  opacity: 1;
}
}

@keyframes scaleIn {
from {
  transform: scale(0.9);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}
}

.animate-fadeIn {
animation: fadeIn 0.3s ease-out;
}

.animate-scaleIn {
animation: scaleIn 0.4s ease-out;
}
`}</style>
</div>
);
}