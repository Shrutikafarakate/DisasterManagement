import { Outlet } from "react-router-dom";
import VolunteerNavbar from "../components/VolunteerNavbar";
import Footer from "../components/Footer";

export default function VolunteerLayout() {
  return (
    <div className="flex h-screen bg-[#1d222c] overflow-hidden">

      {/* 1. FIXED SIDEBAR */}
      <div className="flex-shrink-0">
        <VolunteerNavbar />
      </div>

      {/* 2. SCROLLABLE MAIN AREA */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative">

        <main className="flex-1 p-8 pb-20">
          <Outlet />
        </main>

        <Footer />
      </div>

    </div>
  );
}