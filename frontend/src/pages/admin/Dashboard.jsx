import React from "react";
import { FaStore, FaUsers, FaShoppingBag, FaWallet } from "react-icons/fa";
import { useGetProductsQuery } from "../../slices/productsApiSlice";
import { useGetUsersQuery } from "../../slices/usersApiSlice";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import { addCurrency } from "../../utils/addCurrency";
import SpinningCubeLoader from "../../components/SpinningCubeLoader";
import Meta from "../../components/Meta";
import ProductPriceChart from "../../components/Admin/ProductPriceChart";
import OrderPriceChart from "../../components/Admin/OrderPriceChart";
import DashboardCard from "../../components/Admin/DashboardCard";

const Dashboard = () => {
	const { data, isLoading } = useGetProductsQuery({});
	const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({});
	const { data: orders, isLoading: isOrdersLoading } = useGetOrdersQuery({});

	return (
		<div className="p-4 md:p-6">
			<Meta title={"Admin Dashboard"} />

			{isLoading || isUsersLoading || isOrdersLoading ? (
				<SpinningCubeLoader />
			) : (
				<div className="space-y-6">
					{/* Stats Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
						<DashboardCard
							title={"Products"}
							icon={<FaStore size={40} />}
							value={data?.total}
							bgColor={"bg-sky-500"}
						/>
						<DashboardCard
							title={"Users"}
							icon={<FaUsers size={40} />}
							value={users?.length}
							bgColor={"bg-red-500"}
						/>
						<DashboardCard
							title={"Orders"}
							icon={<FaShoppingBag size={40} />}
							value={orders?.length}
							bgColor={"bg-amber-500"}
						/>
						<DashboardCard
							title={"Revenue"}
							icon={<FaWallet size={40} />}
							value={addCurrency(
								orders?.reduce(
									(acc, item) => acc + (item.totalPrice || 0),
									0
								) || 0
							)}
							bgColor={"bg-emerald-500"}
						/>
					</div>

					{/* Charts */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
						<div className="bg-white p-4 rounded-lg shadow-md">
							<ProductPriceChart products={data?.products} />
						</div>
						<div className="bg-white p-4 rounded-lg shadow-md">
							<OrderPriceChart orders={orders} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
