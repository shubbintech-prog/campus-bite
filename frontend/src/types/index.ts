export interface MenuItem {
  id: number;
  menu_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  available: boolean;
  category: string;
}

export interface Vendor {
  id: number;
  vendor_name: string;
  owner_name: string;
  email: string;
  phone: string;
  location: string;
  location_landmark: string;
  rating: number;
  image_url?: string;
  status: 'active' | 'inactive' | 'pending';
  categories?: string[];
  is_busy?: boolean;
  wait_time_estimate?: number;
  menu_items?: MenuItem[];
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'student' | 'vendor' | 'super_admin' | 'auditor' | 'support';
  phone?: string;
  balance?: number;
  image_url?: string;
}
