"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, storage } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Home, Users, User, X, CheckCircle, Edit, Check, Upload, Image as ImageIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Member {
  fullName: string;
  surname: string;
  fatherName: string;
  motherName: string;
  aadhaar: string;
  phone: string;
  dob: string;
}

export default function RegistrationSection() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null);

  // Step 1 - House Details
  const [houseName, setHouseName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [location, setLocation] = useState("");
  const [roadName, setRoadName] = useState("");
  const [address, setAddress] = useState("");

  // Step 2 - Family Members
  const [members, setMembers] = useState<Member[]>([]);
  
  // Modal form fields
  const [modalFullName, setModalFullName] = useState("");
  const [modalSurname, setModalSurname] = useState("");
  const [modalFatherName, setModalFatherName] = useState("");
  const [modalMotherName, setModalMotherName] = useState("");
  const [modalAadhaar, setModalAadhaar] = useState("");
  const [modalPhone, setModalPhone] = useState("");
  const [modalDob, setModalDob] = useState("");

  // Step 3 - Primary Member Details
  const [selectedMember, setSelectedMember] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [guardianPhoto, setGuardianPhoto] = useState<File | null>(null);
  const [guardianPhotoPreview, setGuardianPhotoPreview] = useState("");
  const [guardianPhotoURL, setGuardianPhotoURL] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const openMemberModal = () => {
    setEditingMemberIndex(null);
    setModalFullName("");
    setModalSurname("");
    setModalFatherName("");
    setModalMotherName("");
    setModalAadhaar("");
    setModalPhone("");
    setModalDob("");
    setShowMemberModal(true);
  };

  const openEditMemberModal = (index: number) => {
    const member = members[index];
    setEditingMemberIndex(index);
    setModalFullName(member.fullName);
    setModalSurname(member.surname);
    setModalFatherName(member.fatherName);
    setModalMotherName(member.motherName);
    setModalAadhaar(member.aadhaar);
    setModalPhone(member.phone);
    setModalDob(member.dob);
    setShowMemberModal(true);
  };

  const closeMemberModal = () => {
    setShowMemberModal(false);
    setEditingMemberIndex(null);
    setModalFullName("");
    setModalSurname("");
    setModalFatherName("");
    setModalMotherName("");
    setModalAadhaar("");
    setModalPhone("");
    setModalDob("");
  };

  const saveMember = () => {
    if (!modalFullName || !modalSurname || !modalFatherName || !modalMotherName || !modalAadhaar || !modalDob) {
      toast.error("Please fill all required member details", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (modalAadhaar.length !== 12) {
      toast.error("Aadhaar number must be 12 digits", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (modalPhone && modalPhone.length !== 10) {
      toast.error("Phone number must be 10 digits", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const newMember: Member = {
      fullName: modalFullName,
      surname: modalSurname,
      fatherName: modalFatherName,
      motherName: modalMotherName,
      aadhaar: modalAadhaar,
      phone: modalPhone,
      dob: modalDob,
    };

    if (editingMemberIndex !== null) {
      // Editing existing member
      const updated = [...members];
      updated[editingMemberIndex] = newMember;
      setMembers(updated);
      toast.success("Member updated successfully", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      // Adding new member
      setMembers([...members, newMember]);
      toast.success("Member added successfully", {
        position: "top-center",
        autoClose: 2000,
      });
    }

    closeMemberModal();
  };

  const removeMember = (index: number) => {
    const updated = [...members];
    updated.splice(index, 1);
    setMembers(updated);
    toast.info("Member removed", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      setGuardianPhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setGuardianPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadGuardianPhoto = async (): Promise<string> => {
    if (!guardianPhoto) return "";

    return new Promise((resolve, reject) => {
      setIsUploading(true);
      
      // Generate unique filename
      const timestamp = Date.now();
      const filename = `guardian-photos/${timestamp}_${guardianPhoto.name}`;
      const storageRef = ref(storage, filename);
      
      const uploadTask = uploadBytesResumable(storageRef, guardianPhoto);
      
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error("Upload error:", error);
          setIsUploading(false);
          toast.error("Failed to upload photo. Please try again.", {
            position: "top-center",
            autoClose: 3000,
          });
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setGuardianPhotoURL(downloadURL);
            setIsUploading(false);
            toast.success("Photo uploaded successfully!", {
              position: "top-center",
              autoClose: 2000,
            });
            resolve(downloadURL);
          } catch (error) {
            setIsUploading(false);
            reject(error);
          }
        }
      );
    });
  };

  const removeGuardianPhoto = () => {
    setGuardianPhoto(null);
    setGuardianPhotoPreview("");
    setGuardianPhotoURL("");
    setUploadProgress(0);
  };

  const validateStep1 = () => {
    if (!houseName || !familyName || !location || !roadName || !address) {
      toast.error("Please fill all required fields", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (members.length === 0) {
      toast.error("Please add at least one family member", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Upload guardian photo if selected
      let photoURL = guardianPhotoURL;
      if (guardianPhoto && !guardianPhotoURL) {
        photoURL = await uploadGuardianPhoto();
      }

      const data = {
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
          photoURL: photoURL || "",
        },
        totalMembers: members.length,
        createdAt: new Date().toISOString(),
        registrationDate: new Date().toLocaleDateString(),
      };

      const docRef = await addDoc(collection(db, "families"), data);
      console.log("Document written with ID:", docRef.id);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data! Please try again.", {
        position: "top-center",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setHouseName("");
    setFamilyName("");
    setLocation("");
    setRoadName("");
    setAddress("");
    setMembers([]);
    setSelectedMember("");
    setPhone("");
    setWhatsapp("");
    setGuardianPhoto(null);
    setGuardianPhotoPreview("");
    setGuardianPhotoURL("");
    setUploadProgress(0);
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
                  required
                />
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
                  required
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
                    required
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
                    required
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
                  required
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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <h2 className="text-xl font-semibold flex items-center text-gray-800">
                  <Users className="w-5 h-5 mr-2 text-emerald-600" />
                  Family Members
                </h2>
                <button
                  onClick={openMemberModal}
                  className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <Users className="w-4 h-4" />
                  + Add Member
                </button>
              </div>

              {members.length > 0 ? (
                <div className="space-y-3">
                  {members.map((m, i) => (
                    <div key={i} className="flex gap-3 items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{m.fullName} {m.surname}</p>
                      </div>
                      <button
                        onClick={() => openEditMemberModal(i)}
                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition"
                        title="Edit member"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => removeMember(i)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Remove member"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No family members added yet</p>
                  <p className="text-sm text-gray-400">Click the &quot;Add Member&quot; button above to add members</p>
                </div>
              )}

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
                Family Guardian Details
              </h2>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200">
                <h3 className="text-sm font-semibold text-emerald-800 mb-4 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Select a Family Guardian
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guardian Name *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-white"
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                  >
                    <option value="">Choose a family member</option>
                    {members.map((m, i) => (
                      <option key={i} value={`${m.fullName} ${m.surname}`}>
                        {m.fullName} {m.surname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Contact Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                  disabled={isUploading}
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (!selectedMember || !phone) {
                      toast.error("Please fill all required fields", {
                        position: "top-center",
                        autoClose: 3000,
                      });
                      return;
                    }
                    if (phone.length !== 10) {
                      toast.error("Phone number must be 10 digits", {
                        position: "top-center",
                        autoClose: 3000,
                      });
                      return;
                    }
                    if (whatsapp && whatsapp.length !== 10) {
                      toast.error("WhatsApp number must be 10 digits if provided", {
                        position: "top-center",
                        autoClose: 3000,
                      });
                      return;
                    }
                    setStep(4);
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUploading}
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
                    <div key={i} className="bg-white p-3 rounded-lg">
                      <p className="font-medium text-gray-900">{m.fullName} {m.surname}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                        <span>📱 {m.phone}</span>
                        <span>🆔 {formatAadhaar(m.aadhaar)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Member Review */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <User className="w-4 h-4 mr-2 text-purple-600" />
                    Family Guardian
                  </h3>
                  <button
                    onClick={() => setStep(3)}
                    className="text-purple-600 hover:text-purple-700 flex items-center text-sm font-medium"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Guardian Name</p>
                      <p className="font-medium text-gray-900">{selectedMember}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">WhatsApp</p>
                      <p className="font-medium text-gray-900">{whatsapp}</p>
                    </div>
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all duration-300 ease-out animate-scale-in">
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
              onClick={() => {
                resetForm();
                router.push('/');
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center transform hover:scale-[1.02]"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </button>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMemberModal}
          />
          
          {/* Modal Container - Desktop: centered, Mobile: bottom sheet */}
          <div className="
            relative w-full
            md:max-w-2xl md:mx-auto md:my-8 md:rounded-2xl
            max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:rounded-t-2xl max-md:max-h-[90vh]
            bg-white shadow-2xl
            transform transition-all duration-300 ease-out
            animate-slide-up
          ">
            {/* Mobile handle indicator */}
            <div className="md:hidden flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Scrollable content container */}
            <div className="overflow-y-auto max-h-[calc(90vh-1rem)] md:max-h-[85vh] p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
                  <User className="w-6 h-6 mr-2 text-emerald-600" />
                  {editingMemberIndex !== null ? "Edit Family Member" : "Add Family Member"}
                </h3>
                <button
                  onClick={closeMemberModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Mohammed"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      value={modalFullName}
                      onChange={(e) => setModalFullName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surname *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Rahman"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      value={modalSurname}
                      onChange={(e) => setModalSurname(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Father Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Abdul Rahman"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      value={modalFatherName}
                      onChange={(e) => setModalFatherName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mother Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Fatima"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      value={modalMotherName}
                      onChange={(e) => setModalMotherName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    value={modalDob}
                    onChange={(e) => setModalDob(e.target.value)}
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
                    value={modalAadhaar}
                    onChange={(e) => setModalAadhaar(e.target.value.replace(/\D/g, ""))}
                  />
                  {modalAadhaar && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatAadhaar(modalAadhaar)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value.replace(/\D/g, ""))}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeMemberModal}
                    className="flex-1 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveMember}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-[1.02]"
                  >
                    {editingMemberIndex !== null ? "Update Member" : "Add Member"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />

      <style dangerouslySetInnerHTML={{
        __html: `
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
          
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(100%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @media (min-width: 768px) {
            @keyframes slide-up {
              from {
                opacity: 0;
                transform: scale(0.95) translateY(20px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          }
          
          .animate-scale-in {
            animation: scale-in 0.3s ease-out;
          }
          
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
        `
      }} />
    </div>
  );
}