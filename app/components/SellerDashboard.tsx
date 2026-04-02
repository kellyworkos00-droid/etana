"use client";

import { useEffect, useState } from "react";
import { fetchSellerDashboard, fetchSellerOrders } from "@/lib/seller-api";

interface SellerDashboardProps {
  sellerId: string;
}

export function SellerDashboard({ sellerId }: SellerDashboardProps) {
  const [data, setData] = useState<any>(null);
  const [orders, setOrders] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "subscription">("overview");

  useEffect(() => {
    loadDashboard();
  }, [sellerId]);

  async function loadDashboard() {
    setLoading(true);
    try {
      const dashboardData = await fetchSellerDashboard(sellerId);
      setData(dashboardData);
      
      const ordersData = await fetchSellerOrders(sellerId, 10);
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !data) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  const { seller, subscription, earnings, recentOrders } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold">{seller.businessName}</h1>
        <p className="text-blue-100 mt-1">{seller.businessType}</p>
        <div className="flex gap-8 mt-4 text-sm">
          <div>
            <div className="text-blue-100">Status</div>
            <div className="font-semibold capitalize">{seller.status}</div>
          </div>
          <div>
            <div className="text-blue-100">Rating</div>
            <div className="font-semibold">⭐ {seller.rating}/5</div>
          </div>
          <div>
            <div className="text-blue-100">Member Since</div>
            <div className="font-semibold">{new Date(seller.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-4">
          {["overview", "orders", "subscription"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Orders"
              value={earnings.totalOrders}
              icon="📦"
            />
            <StatCard
              label="Total Revenue"
              value={`KES ${earnings.totalRevenue.toLocaleString()}`}
              icon="💰"
            />
            <StatCard
              label="Platform Commissions"
              value={`KES ${earnings.totalCommissions.toLocaleString()}`}
              icon="📊"
              subtitle={`${((earnings.totalCommissions / earnings.totalRevenue) * 100).toFixed(1)}% of revenue`}
            />
            <StatCard
              label="Your Payout"
              value={`KES ${earnings.totalPayout.toLocaleString()}`}
              icon="✅"
              highlight
            />
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label="Average Order Value"
              value={`KES ${earnings.averageOrderValue.toLocaleString()}`}
            />
            <MetricCard
              label="Monthly Subscription Cost"
              value={`KES ${earnings.subscriptionCost.toLocaleString()}`}
            />
            <MetricCard
              label="Net Earnings After Subscription"
              value={`KES ${earnings.netEarnings.toLocaleString()}`}
              highlight={earnings.netEarnings > 0}
            />
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 py-4">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">KES {Number(order.subtotal).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        {order.deliveredAt
                          ? `Delivered ${new Date(order.deliveredAt).toLocaleDateString()}`
                          : `Status: ${order.status}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-bold mb-4">All Orders</h2>
          {orders?.orders.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Order #</th>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">City</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                    <th className="px-4 py-2 text-right">Commission</th>
                    <th className="px-4 py-2 text-right">Your Payout</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.orders.map((order: any) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-xs">{order.orderNumber}</td>
                      <td className="px-4 py-2">{order.customerName}</td>
                      <td className="px-4 py-2">{order.city}</td>
                      <td className="px-4 py-2 text-right">KES {Number(order.subtotal).toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-red-600">-KES {Number(order.platformFee).toLocaleString()}</td>
                      <td className="px-4 py-2 text-right font-semibold text-green-600">
                        KES {Number(order.sellerPayout).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.paymentStatus === "RELEASED"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.paymentStatus === "RELEASED" ? "Paid" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === "subscription" && (
        <SubscriptionSection subscription={subscription} onUpgrade={loadDashboard} />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  subtitle,
  highlight,
}: {
  label: string;
  value: string | number;
  icon: string;
  subtitle?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg border ${highlight ? "bg-green-50 border-green-200" : "bg-white"}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function MetricCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg border ${highlight ? "bg-blue-50 border-blue-200" : "bg-white"}`}>
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <p className={`text-xl font-bold ${highlight ? "text-blue-600" : ""}`}>{value}</p>
    </div>
  );
}

function SubscriptionSection({
  subscription,
  onUpgrade,
}: {
  subscription: any;
  onUpgrade: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade(tier: string) {
    setLoading(true);
    // This will be implemented in the actual seller app
    console.log("Upgrading to:", tier);
    setLoading(false);
    onUpgrade();
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-bold mb-4">Current Subscription</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Plan</p>
            <p className="text-2xl font-bold">{subscription.tier}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Status</p>
            <p className="text-lg font-semibold">{subscription.status}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Expires</p>
            {subscription.expiresAt ? (
              <p className="text-lg font-semibold">
                {new Date(subscription.expiresAt).toLocaleDateString()}
              </p>
            ) : (
              <p className="text-lg font-semibold">N/A</p>
            )}
          </div>
        </div>
        {subscription.current && (
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <p className="text-sm font-semibold mb-2">Auto-Renewal</p>
            <p className="text-sm text-gray-700">
              {subscription.current.autoRenew ? "✅ Enabled" : "❌ Disabled"}
            </p>
          </div>
        )}
      </div>

      {/* Subscription Plans */}
      <div>
        <h2 className="text-lg font-bold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(subscription.upgrades).map(([key, plan]: any) => (
            <div
              key={key}
              className={`p-6 rounded-lg border-2 transition ${
                plan.tier === subscription.tier
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              <p className="text-xl font-bold">{plan.tier}</p>
              <p className="text-2xl font-bold mt-2">
                {plan.price === 0 ? "Free" : `KES ${plan.price.toLocaleString()}`}
              </p>
              <p className="text-xs text-gray-500 mt-1">per month</p>

              <div className="mt-4 space-y-2 border-t pt-4 text-sm">
                <Feature included={plan.features.maxProducts !== "unlimited"}>
                  Max Products: {plan.features.maxProducts}
                </Feature>
                <Feature included={plan.features.analyticsAccess}>
                  {plan.features.analyticsAccess ? "✅" : "❌"} Analytics Access
                </Feature>
                <Feature included={plan.features.prioritySupport}>
                  {plan.features.prioritySupport ? "✅" : "❌"} Priority Support
                </Feature>
              </div>

              {plan.tier !== subscription.tier && (
                <button
                  onClick={() => handleUpgrade(plan.tier)}
                  disabled={loading}
                  className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Upgrading..." : "Upgrade"}
                </button>
              )}
              {plan.tier === subscription.tier && (
                <div className="w-full mt-4 py-2 text-center bg-green-100 text-green-800 rounded font-semibold">
                  Current Plan
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Feature({ included, children }: { included: boolean; children: React.ReactNode }) {
  return <p className={included ? "" : "text-gray-400"}>{children}</p>;
}
