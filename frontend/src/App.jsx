import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigationHeader from "./components/NavigationHeader";
import SiteFooter from "./components/Footer";

const App = () => {
	return (
		<div className="relative min-h-screen flex flex-col bg-gray-50">
			<NavigationHeader />
			<main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
				<Outlet />
			</main>
			<SiteFooter />
			<ToastContainer autoClose={1000} />
		</div>
	);
};

export default App;
