import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata = {
  title: "Admin | Rodrigo Herrera",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
