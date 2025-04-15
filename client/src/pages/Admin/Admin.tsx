import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, FileText, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Jobs",
    value: "24",
    change: "+2 from last month",
    icon: Briefcase,
  },
  {
    title: "Active Users",
    value: "1,234",
    change: "+15% from last month",
    icon: Users,
  },
  {
    title: "Applications",
    value: "573",
    change: "+201 this week",
    icon: FileText,
  },
  {
    title: "Conversion Rate",
    value: "12.5%",
    change: "+2.1% from last month",
    icon: TrendingUp,
  },
];

const Admin = () => {
  return (
    <div className="space-y-8 px-4 py-6 md:px-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-gray-800 border border-gray-700 shadow-sm hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-300">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-gray-400">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Admin;
