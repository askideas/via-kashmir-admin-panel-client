import { Bell, Building2, ChartBarStacked, Folders, IdCardLanyard, IndianRupee, LayoutDashboard, Megaphone, Users } from "lucide-react";

export const menuData = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard />,
        link: '/dashboard'
    },
    {
        id: 'bookings',
        label: 'Bookings',
        icon: <Folders />,
        link: '/bookings'
    },
    {
        id: 'categories',
        label: 'Categories',
        icon: <ChartBarStacked />,
        link: '/categories'
    },
    {
        id: 'vendors',
        label: 'Vendors',
        icon: <Building2 />,
        link: '/vendors'
    },
    {
        id: 'users',
        label: 'Users',
        icon: <Users />,
        link: '/users'
    },
    {
        id: 'payments',
        label: 'Payments',
        icon: <IndianRupee />,
        link: '/payments'
    },
    {
        id: 'appnotifications',
        label: 'App Notifications',
        icon: <Bell />,
        link: '/appnotifications'
    },
    {
        id: 'advertisements',
        label: 'Vendors Advertisements',
        icon: <Megaphone />,
        link: '/vendorsadvertisements'
    },
    {
        id: 'manageemployees',
        label: 'Manage Employees',
        icon: <IdCardLanyard />,
        link: '/employees'
    }
]