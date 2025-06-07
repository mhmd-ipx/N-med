export interface User {
  id: number;
  name: string;
  phone: string;
  role: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  related_data: any | null;
}

export interface Cancellation {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface CancellationRequest {
  user_id: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface CancellationResponse {
  id: number;
  user_id: string;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export type CancellationsResponse = Cancellation[];