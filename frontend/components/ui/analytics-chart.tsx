"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
    { name: "Jan", revenue: 4000, orders: 240 },
    { name: "Feb", revenue: 3000, orders: 139 },
    { name: "Mar", revenue: 2000, orders: 980 },
    { name: "Apr", revenue: 2780, orders: 390 },
    { name: "May", revenue: 1890, orders: 480 },
    { name: "Jun", revenue: 2390, orders: 380 },
    { name: "Jul", revenue: 3490, orders: 430 },
    { name: "Aug", revenue: 4000, orders: 240 },
    { name: "Sep", revenue: 3000, orders: 139 },
    { name: "Oct", revenue: 2000, orders: 980 },
    { name: "Nov", revenue: 2780, orders: 390 },
    { name: "Dec", revenue: 1890, orders: 480 },
]

export function AnalyticsChart() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
        </ResponsiveContainer>
    )
}
