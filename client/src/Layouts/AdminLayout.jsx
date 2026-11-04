import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import AdminErrorBoundary from "../components/AdminErrorBoundary";

export default function AdminLayout() {
  return (
    <AdminErrorBoundary>
      {/* 'flex' makes items sit side-by-side (Left Sidebar | Right Content) */}
      <div className="flex h-screen w-screen bg-[#1d222c] overflow-hidden">

        {/* Sidebar Container (Fixed Width) */}
        <div className="flex-shrink-0">
          <AdminNavbar />
        </div>

        {/* Main Content (Scrollable) */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto">
          <main className="p-8 pb-20">
            <Outlet />
          </main>
          <Footer />
        </div>

      </div>
    </AdminErrorBoundary>
  );
}

