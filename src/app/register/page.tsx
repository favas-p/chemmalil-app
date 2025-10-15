"use client";
import { useState } from "react";
import { User, Home, Users, DollarSign, Calendar, Phone, Mail, MapPin, LogOut, Menu, X } from "lucide-react";

// Mock Authentication & Data Storage
const MOCK_USER = {
  email: "test@example.com",
  password: "password123",
  familyData: {
    houseNumber: "123",
    houseName: "Noor Manzil",
    familyName: "Abdullah",
    location: "Central Area",
    roadName: "Masjid Road",
    address: "123 Masjid Road, Central Area, City",
    members: [
      { name: "Mohammed Abdullah", role: "Father" },
      { name: "Fatima Abdullah", role: "Mother" },
      { name: "Ahmed Abdullah", role: "Son" },
      { name: "Aisha Abdullah", role: "Daughter" }
    ],
    selectedMember: "Mohammed Abdullah",
    dob: "1980-05-15",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    aadhar: "1234 5678 9012",
    email: "test@example.com"
  },
  paymentDues: [
    { month: "October 2024", amount: 500, status: "pending" },
    { month: "September 2024", amount: 500, status: "paid" },
    { month: "August 2024", amount: 500, status: "paid" }
  ]
};

export default function MosqueManagementApp() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Registration state
  const [regStep, setRegStep] = useState(1);
  const [houseNumber, setHouseNumber] = useState("");
  const [houseName, setHouseName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [location, setLocation] = useState("");
  const [roadName, setRoadName] = useState("");
  const [address, setAddress] = useState("");
  const [members, setMembers] = useState([{ name: "", role: "Son" }]);
  const [selectedMember, setSelectedMember] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail === MOCK_USER.email && loginPassword === MOCK_USER.password) {
      setIsLoggedIn(true);
      setCurrentPage("dashboard");
      alert("Login successful!");
    } else {
      alert("Invalid credentials. Try: test@example.com / password123");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("home");
    setLoginEmail("");
    setLoginPassword("");
  };

  const addMember = () => {
    setMembers([...members, { name: "", role: "Son" }]);
  };

  const removeMember = (index) => {
    const updated = [...members];
    updated.splice(index, 1);
    setMembers(updated);
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleRegistrationSubmit = () => {
    const data = {
      houseNumber, houseName, familyName, location, roadName, address,
      members, selectedMember, dob, phone, whatsapp, aadhar, email,
      createdAt: new Date().toISOString()
    };
    console.log("Registration Data:", data);
    alert("Registration successful! You can now login.");
    setCurrentPage("login");
    // Reset form
    setRegStep(1);
  };

  // Hero Section
  const HeroSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Masjid Portal
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4">
              <button onClick={() => setCurrentPage("home")} className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md font-medium transition">
                Home
              </button>
              <button onClick={() => setCurrentPage("register")} className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md font-medium transition">
                Register
              </button>
              <button onClick={() => setCurrentPage("login")} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition">
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4">
              <button onClick={() => { setCurrentPage("home"); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-emerald-50 rounded-md">
                Home
              </button>
              <button onClick={() => { setCurrentPage("register"); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-emerald-50 rounded-md">
                Register
              </button>
              <button onClick={() => { setCurrentPage("login"); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-emerald-50 rounded-md">
                Login
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to Our
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Masjid Community
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Manage your family registration, track contributions, and stay connected with our mosque community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setCurrentPage("register")} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition transform hover:scale-105">
              Register Your Family
            </button>
            <button onClick={() => setCurrentPage("login")} className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold border-2 border-emerald-600 hover:bg-emerald-50 transition">
              Login to Dashboard
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Family Management</h3>
            <p className="text-gray-600">Register and manage all family members in one place</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Payment Tracking</h3>
            <p className="text-gray-600">Track monthly contributions and payment history</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community Updates</h3>
            <p className="text-gray-600">Stay informed about mosque events and announcements</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Login Page
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Login to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button onClick={() => setCurrentPage("register")} className="text-emerald-600 font-semibold hover:underline">
              Register here
            </button>
          </p>
          <button onClick={() => setCurrentPage("home")} className="text-gray-500 hover:text-gray-700 mt-4 text-sm">
            ← Back to Home
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
          Demo: test@example.com / password123
        </div>
      </div>
    </div>
  );

  // Registration Page
  const RegisterPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Family Registration</h1>
          <p className="text-center text-gray-600 mb-8">Step {regStep} of 3</p>

          {/* Progress Bar */}
          <div className="flex mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1">
                <div className={`h-2 rounded-full ${step <= regStep ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gray-200'}`} />
              </div>
            ))}
          </div>

          {/* Step 1: House Details */}
          {regStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Home className="w-5 h-5 mr-2 text-emerald-600" />
                House Information
              </h2>
              <input placeholder="House Number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} />
              <input placeholder="House Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={houseName} onChange={(e) => setHouseName(e.target.value)} />
              <input placeholder="Family Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
              <input placeholder="Location" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={location} onChange={(e) => setLocation(e.target.value)} />
              <input placeholder="Road Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={roadName} onChange={(e) => setRoadName(e.target.value)} />
              <textarea placeholder="Detailed Address" rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={address} onChange={(e) => setAddress(e.target.value)} />
              <button onClick={() => setRegStep(2)} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                Next Step
              </button>
            </div>
          )}

          {/* Step 2: Family Members */}
          {regStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-emerald-600" />
                Family Members
              </h2>
              {members.map((m, i) => (
                <div key={i} className="flex gap-2">
                  <input placeholder="Member Name" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={m.name} onChange={(e) => handleMemberChange(i, "name", e.target.value)} />
                  <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={m.role} onChange={(e) => handleMemberChange(i, "role", e.target.value)}>
                    <option>Father</option>
                    <option>Mother</option>
                    <option>Son</option>
                    <option>Daughter</option>
                    <option>Wife</option>
                  </select>
                  {members.length > 1 && (
                    <button onClick={() => removeMember(i)} className="px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addMember} className="w-full py-3 border-2 border-dashed border-emerald-300 text-emerald-600 rounded-lg hover:bg-emerald-50 transition font-medium">
                + Add Member
              </button>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setRegStep(1)} className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
                  Back
                </button>
                <button onClick={() => setRegStep(3)} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Primary Member Details */}
          {regStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-emerald-600" />
                Primary Member Details
              </h2>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
                <option value="">Select Primary Member</option>
                {members.map((m, i) => (
                  <option key={i} value={m.name}>{m.name} ({m.role})</option>
                ))}
              </select>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={dob} onChange={(e) => setDob(e.target.value)} />
              </div>
              <input placeholder="Phone Number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input placeholder="WhatsApp Number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              <input placeholder="Aadhar Number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={aadhar} onChange={(e) => setAadhar(e.target.value)} />
              <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setRegStep(2)} className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
                  Back
                </button>
                <button onClick={handleRegistrationSubmit} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                  Complete Registration
                </button>
              </div>
            </div>
          )}

          <button onClick={() => setCurrentPage("home")} className="w-full text-center text-gray-500 hover:text-gray-700 mt-6 text-sm">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  // Dashboard
  const Dashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Family Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {MOCK_USER.familyData.familyName} Family</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Members</p>
                <p className="text-3xl font-bold text-gray-900">{MOCK_USER.familyData.members.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Dues</p>
                <p className="text-3xl font-bold text-orange-600">₹500</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Payments Made</p>
                <p className="text-3xl font-bold text-green-600">2</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Family Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Home className="w-5 h-5 mr-2 text-emerald-600" />
              Family Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{MOCK_USER.familyData.houseName}</p>
                  <p className="text-sm text-gray-700">{MOCK_USER.familyData.address}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{MOCK_USER.familyData.phone}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{MOCK_USER.familyData.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2 text-emerald-600" />
                Family Members
              </h3>
              <div className="space-y-2">
                {MOCK_USER.familyData.members.map((member, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">{member.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Dues */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
              Payment History
            </h2>
            <div className="space-y-3">
              {MOCK_USER.paymentDues.map((payment, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{payment.month}</p>
                    <p className="text-sm text-gray-600">₹{payment.amount}</p>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                    payment.status === 'paid' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {payment.status === 'paid' ? '✓ Paid' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Main Render
  return (
    <div>
      {!isLoggedIn && currentPage === "home" && <HeroSection />}
      {!isLoggedIn && currentPage === "login" && <LoginPage />}
      {!isLoggedIn && currentPage === "register" && <RegisterPage />}
      {isLoggedIn && <Dashboard />}
    </div>
  );
}