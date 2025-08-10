import React from "react";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import AdminHeader from "./components/Admin/AdminHeader";
import SiteFooter from "./components/Footer";
import { useSelector } from "react-redux";
import AdminSidebar from "./components/Admin/AdminSidebar";

const AdminDashboard = () => {
	const { userInfo } = useSelector((state) => state.auth);

	return (
		<div className="relative min-h-screen bg-gray-100">
			<AdminHeader />
			<div className="flex">
				{/* Sidebar */}
				<aside className="hidden md:block md:w-1/5 lg:w-1/6 bg-gray-900 text-white h-screen pt-20 fixed">
					<div className="px-4">
						<AdminSidebar />
					</div>
				</aside>
				{/* Main Content */}
				<main className="flex-1 ml-0 md:ml-[20%] lg:ml-[16.6667%] p-4 pt-24">
					<Outlet />
				</main>
			</div>
			<SiteFooter />
			<ToastContainer />
		</div>
	);
};

export default AdminDashboard;
