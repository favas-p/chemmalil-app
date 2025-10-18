"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { 
  Shield, 
  LogOut, 
  Home, 
  Users, 
  TrendingUp, 
  Search,
  Calendar,
  Phone,
  MapPin,
  DollarSign,
  FileText,
  Eye
} from "lucide-react";

interface Member {
  name: string;
  position: string;
}

interface PrimaryMember {
  name: string;
  phone: string;
  whatsapp: string;
  aadhaar: string;
  dob: string;
}

interface FamilyData {
  id: string;
  houseNumber: string;
  houseName: string;
  familyName: string;
  location: string;
  roadName: string;
  address: string;
  members: Member[];
  primaryMember: PrimaryMember;
  totalMembers: number;
  registrationDate: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [families, setFamilies] = useState<FamilyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFamily, setSelectedFamily] = useState<FamilyData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Check admin authentication
    if (typeof window !== "undefined") {
      const isAdmin = sessionStorage.getItem("isAdmin");
      if (!isAdmin) {
        router.push("/admin");
        return;
      }
    }
    fetchFamilies();
  }, [router]);

  const fetchFamilies = async () => {
    try {
      const q = query(collection(db, "families"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const familiesData: FamilyData[] = [];
      querySnapshot.forEach((doc) => {
        familiesData.push({ id: doc.id, ...doc.data() } as FamilyData);
      });

      setFamilies(familiesData);
    } catch (error) {
      console.error("Error fetching families:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("isAdmin");
    }
    router.push("/admin");
  };

  const totalMembers = families.reduce((sum, family) => sum + (family.totalMembers || 0), 0);
  const totalFamilies = families.length;

  const filteredFamilies = families.filter(family => 
    family.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.houseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewFamilyDetails = (family: FamilyData) => {
    setSelectedFamily(family);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Admin Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-purple-300">Masjid Management System</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition border border-red-500/30"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/20 hover:bg-white/15 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Families</p>
                <p className="text-4xl font-bold text-white mt-2">{totalFamilies}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Home className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/20 hover:bg-white/15 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Members</p>
                <p className="text-4xl font-bold text-white mt-2">{totalMembers}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/20 hover:bg-white/15 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Average Members</p>
                <p className="text-4xl font-bold text-white mt-2">
                  {totalFamilies > 0 ? (totalMembers / totalFamilies).toFixed(1) : 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/20 hover:bg-white/15 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Pending Dues</p>
                <p className="text-4xl font-bold text-white mt-2">₹{totalFamilies * 500}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
            <input
              type="text"
              placeholder="Search by family name, house name, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Families List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden">
          <div className="px-6 py-4 bg-white/5 border-b border-white/10">
            <h2 className="text-xl font-bold text-white flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              All Registered Families ({filteredFamilies.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Family Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredFamilies.map((family, index) => (
                  <tr key={family.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-white">{family.houseName}</p>
                        <p className="text-sm text-purple-300">{family.familyName} Family</p>
                        <p className="text-xs text-purple-400">House #{family.houseNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-white">{family.location}</p>
                          <p className="text-xs text-purple-400">{family.roadName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-purple-400 mr-2" />
                        <span className="text-white font-semibold">{family.totalMembers}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <Phone className="w-4 h-4 text-purple-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-white">{family.primaryMember.phone}</p>
                          <p className="text-xs text-purple-400">{family.primaryMember.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-purple-400 mr-2" />
                        <span className="text-sm text-white">
                          {family.registrationDate || new Date(family.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => viewFamilyDetails(family)}
                        className="flex items-center space-x-1 px-3 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition text-sm font-medium border border-purple-500/30"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredFamilies.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                <p className="text-purple-300 text-lg">No families found</p>
                <p className="text-purple-400 text-sm mt-2">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Family Detail Modal */}
      {showDetailModal && selectedFamily && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Family Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition"
              >
                <span className="text-white text-xl">×</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* House Information */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Home className="w-5 h-5 mr-2 text-purple-400" />
                  House Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-purple-300 text-sm">House Name</p>
                    <p className="text-white font-semibold">{selectedFamily.houseName}</p>
                  </div>
                  <div>
                    <p className="text-purple-300 text-sm">House Number</p>
                    <p className="text-white font-semibold">{selectedFamily.houseNumber}</p>
                  </div>
                  <div>
                    <p className="text-purple-300 text-sm">Family Name</p>
                    <p className="text-white font-semibold">{selectedFamily.familyName}</p>
                  </div>
                  <div>
                    <p className="text-purple-300 text-sm">Location</p>
                    <p className="text-white font-semibold">{selectedFamily.location}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-purple-300 text-sm">Complete Address</p>
                    <p className="text-white font-semibold">{selectedFamily.address}</p>
                  </div>
                </div>
              </div>

              {/* Primary Member */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-400" />
                  Primary Member
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-purple-300 text-sm">Name</p>
                    <p className="text-white font-semibold">{selectedFamily.primaryMember.name}</p>
                  </div>
                  <div>
                    <p className="text-purple-300 text-sm">Date of Birth</p>
                    <p className="text-white font-semibold">{selectedFamily.primaryMember.dob}</p>
                  </div>
                  <div>
                    <p className="text-purple-300 text-sm">Phone</p>
                    <p className="text-white font-semibold">{selectedFamily.primaryMember.phone}</p>
                  </div>
                  <div>
                    <p className="text-purple-300 text-sm">WhatsApp</p>
                    <p className="text-white font-semibold">{selectedFamily.primaryMember.whatsapp}</p>
                  </div>
                  <div>
                    <p className="text-purple-300 text-sm">Aadhaar</p>
                    <p className="text-white font-semibold">{selectedFamily.primaryMember.aadhaar}</p>
                  </div>
                </div>
              </div>

              {/* All Members */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-400" />
                  All Family Members ({selectedFamily.members.length})
                </h4>
                <div className="space-y-2">
                  {selectedFamily.members.map((member, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                    >
                      <span className="text-white font-medium">{member.name}</span>
                      <span className="text-purple-300 text-sm bg-white/10 px-3 py-1 rounded-full">
                        {member.position}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}