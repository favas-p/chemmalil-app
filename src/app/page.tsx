"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Home, Users, DollarSign, Calendar, ArrowRight, UserPlus, LogIn } from "lucide-react";

export default function HomePage() {
  const [totalFamilies, setTotalFamilies] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "families"));
      
      let familiesCount = 0;
      let membersCount = 0;

      querySnapshot.forEach((doc) => {
        familiesCount++;
        const data = doc.data();
        membersCount += data.totalMembers || data.members?.length || 0;
      });

      setTotalFamilies(familiesCount);
      setTotalMembers(membersCount);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pb-20 md:pb-0">
      {/* Desktop Navigation - Top */}
      <nav className="hidden md:block bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
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

            <div className="flex space-x-4">
              <Link
                href="/"
                onClick={() => setActiveTab("home")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "home"
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                Home
              </Link>
              <Link
                href="/register"
                onClick={() => setActiveTab("register")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "register"
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                Register
              </Link>
              <Link
                href="/login"
                onClick={() => setActiveTab("login")}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl z-50 rounded-t-3xl border-t border-gray-200">
        <div className="grid grid-cols-3 gap-1 px-4 py-3">
          <Link
            href="/"
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200 ${
              activeTab === "home"
                ? "bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Home className={`w-6 h-6 mb-1 transition-transform duration-200 ${
              activeTab === "home" ? "scale-110" : ""
            }`} />
            <span className="text-xs font-medium">Home</span>
          </Link>
          
          <Link
            href="/register"
            onClick={() => setActiveTab("register")}
            className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200 ${
              activeTab === "register"
                ? "bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <UserPlus className={`w-6 h-6 mb-1 transition-transform duration-200 ${
              activeTab === "register" ? "scale-110" : ""
            }`} />
            <span className="text-xs font-medium">Register</span>
          </Link>
          
          <Link
            href="/login"
            onClick={() => setActiveTab("login")}
            className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200 ${
              activeTab === "login"
                ? "bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <LogIn className={`w-6 h-6 mb-1 transition-transform duration-200 ${
              activeTab === "login" ? "scale-110" : ""
            }`} />
            <span className="text-xs font-medium">Login</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section - Redesigned */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center md:text-left space-y-6">
            <div className="inline-block">
              <span className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                🕌 Welcome to Our Community
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Building a
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
                Stronger Community
              </span>
              <span className="block mt-2">Together</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Join our mosque community portal. Register your family, manage contributions, and stay connected with our vibrant community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Link
                href="/register"
                className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
              >
                Register Your Family
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              <Link
                href="/login"
                className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold border-2 border-emerald-600 hover:bg-emerald-50 transition-all duration-200 inline-flex items-center justify-center shadow-sm hover:shadow-md"
              >
                Login to Dashboard
              </Link>
            </div>
          </div>

          {/* Right Illustration/Image */}
          <div className="relative mt-8 md:mt-0">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-3xl transform rotate-6 opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-3xl transform -rotate-6 opacity-20"></div>
              
              {/* Main Illustration Container */}
              <div className="relative bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="space-y-6">
                  {/* Icon Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-3">
                        <Home className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">Family</p>
                      <p className="text-sm text-gray-500">Registration</p>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">Community</p>
                      <p className="text-sm text-gray-500">Members</p>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-3">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">Payment</p>
                      <p className="text-sm text-gray-500">Tracking</p>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-3">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">Events</p>
                      <p className="text-sm text-gray-500">Calendar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Stats Section */}
        <div className="mt-16 md:mt-24 bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Our Community Statistics</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-white" />
              </div>
              {loading ? (
                <div className="text-4xl font-bold text-gray-400">...</div>
              ) : (
                <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {totalFamilies}
                </div>
              )}
              <div className="text-gray-600 mt-2 font-medium">Registered Families</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              {loading ? (
                <div className="text-4xl font-bold text-gray-400">...</div>
              ) : (
                <div className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {totalMembers}
                </div>
              )}
              <div className="text-gray-600 mt-2 font-medium">Total Members</div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Family Management</h3>
            <p className="text-gray-600">
              Register and manage all family members in one place with detailed information
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Payment Tracking</h3>
            <p className="text-gray-600">
              Track monthly contributions and maintain payment history records
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community Updates</h3>
            <p className="text-gray-600">
              Stay informed about mosque events, programs, and community announcements
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Community Today</h2>
          <p className="text-lg mb-8 opacity-90">
            Register your family and become part of our growing mosque community
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            Start Registration
          </Link>
        </div>

        {/* Footer */}
        <footer className="bg-white mt-20 py-8 border-t rounded-2xl">
          <div className="text-center text-gray-600">
            <p>© 2024 Masjid Portal. All rights reserved.</p>
            <Link 
              href="/admin/login" 
              className="text-sm text-blue-600 hover:text-blue-700 transition mt-2 inline-block"
            >
              Admin Login →
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}