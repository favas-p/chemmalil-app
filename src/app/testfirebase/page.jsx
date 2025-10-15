import { db } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function TestFirebase() {
  const handleTest = async () => {
    try {
      const ref = await addDoc(collection(db, "test"), { name: "Favas", time: new Date() });
      console.log("✅ Test doc added:", ref.id);
    } catch (err) {
      console.error("❌ Firestore write failed:", err);
    }
  };

  return (
    <div className="p-6">
      <button onClick={handleTest} className="bg-blue-600 text-white px-4 py-2 rounded">
        Test Firebase
      </button>
    </div>
  );
}
