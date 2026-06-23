export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          sort_order: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          sort_order?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          sort_order?: number | null
          created_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          ingredients: string | null
          price: number
          compare_price: number | null
          weight_options: string[] | null
          category_id: string | null
          images: string[] | null
          featured: boolean | null
          bestseller: boolean | null
          stock: number | null
          rating: number | null
          review_count: number | null
          seo_title: string | null
          seo_description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          ingredients?: string | null
          price: number
          compare_price?: number | null
          weight_options?: string[] | null
          category_id?: string | null
          images?: string[] | null
          featured?: boolean | null
          bestseller?: boolean | null
          stock?: number | null
          rating?: number | null
          review_count?: number | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          ingredients?: string | null
          price?: number
          compare_price?: number | null
          weight_options?: string[] | null
          category_id?: string | null
          images?: string[] | null
          featured?: boolean | null
          bestseller?: boolean | null
          stock?: number | null
          rating?: number | null
          review_count?: number | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          user_name: string
          rating: number
          comment: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          user_name: string
          rating: number
          comment?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          user_name?: string
          rating?: number
          comment?: string | null
          created_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          user_email: string
          status: string
          payment_method: string
          payment_status: string
          total_amount: number
          shipping_name: string
          shipping_phone: string
          shipping_address: string
          shipping_city: string
          shipping_state: string
          shipping_pincode: string
          tracking_number: string | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          user_email: string
          status?: string
          payment_method: string
          payment_status?: string
          total_amount: number
          shipping_name: string
          shipping_phone: string
          shipping_address: string
          shipping_city: string
          shipping_state: string
          shipping_pincode: string
          tracking_number?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          user_email?: string
          status?: string
          payment_method?: string
          payment_status?: string
          total_amount?: number
          shipping_name?: string
          shipping_phone?: string
          shipping_address?: string
          shipping_city?: string
          shipping_state?: string
          shipping_pincode?: string
          tracking_number?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          product_image: string | null
          price: number
          quantity: number
          weight_option: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          product_image?: string | null
          price: number
          quantity: number
          weight_option?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          product_image?: string | null
          price?: number
          quantity?: number
          weight_option?: string | null
          created_at?: string | null
        }
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          category: string | null
          sort_order: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          question: string
          answer: string
          category?: string | null
          sort_order?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          category?: string | null
          sort_order?: number | null
          created_at?: string | null
        }
      }
      testimonials: {
        Row: {
          id: string
          name: string
          location: string | null
          rating: number
          comment: string
          avatar_url: string | null
          featured: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          location?: string | null
          rating: number
          comment: string
          avatar_url?: string | null
          featured?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          location?: string | null
          rating?: number
          comment?: string
          avatar_url?: string | null
          featured?: boolean | null
          created_at?: string | null
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          key: string
          value: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          key?: string
          value?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
