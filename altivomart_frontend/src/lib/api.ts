const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.altivomart.com/api';

// Types for API responses
export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  formatted_price: string;
  in_stock: boolean;
  main_image?: string | null;
  category_name: string;
  brand: string;
  featured: boolean;
  tag_list: string[];
  created_at: string;
  description?: string;
  estimated_delivery_days?: number;
  how_to_use?: string;
  tags?: string;
  images?: ProductImage[];
  all_images?: string[];
}

export interface OrderItem {
  product_id: number;
  quantity: number;
}

export interface OrderRequest {
  customer_name: string;
  phone_number: string;
  customer_email?: string;
  address: string;
  city?: string;
  state?: string;
  landmark?: string;
  delivery_instructions?: string;
  items: OrderItem[];
}

export interface Order {
  id: number;
  customer_name: string;
  phone_number: string;
  customer_email: string | null;
  address: string;
  city: string | null;
  state: string | null;
  landmark: string | null;
  delivery_instructions: string | null;
  total_price: string;
  status: 'pending' | 'on_delivery' | 'delivered';
  created_at: string;
  updated_at: string;
  delivered_at: string | null;
  tracking_code: string;
  items: Array<{
    id: number;
    product_name: string;
    quantity: number;
    price: string;
    total_price: string;
  }>;
}

export interface DeliveryTracking {
  order_id: number;
  tracking_code?: string;
  customer_name: string;
  status: string;
  delivery_status: string;
  estimated_delivery: string | null;
  tracking_number: string | null;
  delivery_attempts: number;
  last_attempt_date: string | null;
  delivery_notes: string;
}

// API Functions
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Handle paginated response from Django REST framework
    if (data && typeof data === 'object' && Array.isArray(data.results)) {
      return data.results;
    }
    
    // Fallback for direct array response
    if (Array.isArray(data)) {
      return data;
    }
    
    throw new Error('Invalid data format received from server');
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProduct = async (id: string): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}/`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Validate that we received a product object
    if (!data || typeof data !== 'object' || !data.id) {
      throw new Error('Invalid product data received from server');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export async function createOrder(orderData: OrderRequest): Promise<Order | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create order');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function fetchOrderDetails(id: number): Promise<Order | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch order details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching order details:', error);
    return null;
  }
}

export async function trackDelivery(orderId: number): Promise<DeliveryTracking | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/track/`);
    if (!response.ok) {
      throw new Error('Failed to track delivery');
    }
    return await response.json();
  } catch (error) {
    console.error('Error tracking delivery:', error);
    return null;
  }
}

export async function trackDeliveryByCode(code: string): Promise<DeliveryTracking | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/track/${encodeURIComponent(code)}/`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      try {
        const err = await response.json();
        throw new Error(err?.error || err?.detail || 'Failed to track delivery');
      } catch (_) {
        throw new Error('Failed to track delivery');
      }
    }
    return await response.json();
  } catch (error) {
    console.error('Error tracking delivery by code:', error);
    return null;
  }
}
