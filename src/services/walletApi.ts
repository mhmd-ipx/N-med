import axios from 'axios';

// Define the response types
export interface WalletBalanceResponse {
  success: boolean;
  data: {
    balance: number;
    formatted_balance: string;
  };
}

export interface Transaction {
  id: number;
  wallet_id: number;
  amount: number;
  type: 'withdraw' | 'deposit';
  description: string;
  status: string;
  appointment_id: number | null;
  meta: any | null;
  created_at: string;
  updated_at: string;
  appointment: any | null;
}

export interface WalletTransactionsResponse {
  success: boolean;
  data: {
    transactions: Transaction[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
}

export interface DepositRequest {
  amount: number;
  description: string;
  appointment_id: number | null;
}

export interface DepositResponse {
  success: boolean;
  data: {
    message: string;
    transaction: Transaction;
    new_balance: number;
  };
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://api.niloudarman.ir',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request headers
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsedData: { token: string } = JSON.parse(authData);
      config.headers.Authorization = `Bearer ${parsedData.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get wallet balance
export const getWalletBalance = async (): Promise<WalletBalanceResponse> => {
  try {
    const response = await api.get<WalletBalanceResponse>('/api/wallet/balance');
    return response.data;
  } catch (error) {
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as any;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            throw new Error('درخواست نامعتبر است (400)');
          case 401:
            throw new Error('عدم احراز هویت (401)');
          case 403:
            throw new Error('دسترسی غیرمجاز (403)');
          case 422:
            throw new Error('داده‌های ورودی نامعتبر هستند (422)');
          case 500:
            throw new Error('خطای سرور (500)');
          default:
            throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
        }
      } else if (axiosError.request) {
        throw new Error('هیچ پاسخی از سرور دریافت نشد');
      }
    }
    throw new Error('خطای ناشناخته در دریافت موجودی کیف پول');
  }
};

// Get wallet transactions
export const getWalletTransactions = async (page: number = 1): Promise<WalletTransactionsResponse> => {
  try {
    const response = await api.get<WalletTransactionsResponse>(`/api/wallet/transactions?page=${page}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as any;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            throw new Error('درخواست نامعتبر است (400)');
          case 401:
            throw new Error('عدم احراز هویت (401)');
          case 403:
            throw new Error('دسترسی غیرمجاز (403)');
          case 422:
            throw new Error('داده‌های ورودی نامعتبر هستند (422)');
          case 500:
            throw new Error('خطای سرور (500)');
          default:
            throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
        }
      } else if (axiosError.request) {
        throw new Error('هیچ پاسخی از سرور دریافت نشد');
      }
    }
    throw new Error('خطای ناشناخته در دریافت تراکنش‌های کیف پول');
  }
};

// Deposit to wallet
export const depositToWallet = async (depositData: DepositRequest): Promise<DepositResponse> => {
  try {
    const response = await api.post<DepositResponse>('/api/wallet/deposit', depositData);
    return response.data;
  } catch (error) {
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as any;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            throw new Error('درخواست نامعتبر است (400)');
          case 401:
            throw new Error('عدم احراز هویت (401)');
          case 403:
            throw new Error('دسترسی غیرمجاز (403)');
          case 422:
            throw new Error('داده‌های ورودی نامعتبر هستند (422)');
          case 500:
            throw new Error('خطای سرور (500)');
          default:
            throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
        }
      } else if (axiosError.request) {
        throw new Error('هیچ پاسخی از سرور دریافت نشد');
      }
    }
    throw new Error('خطای ناشناخته در شارژ کیف پول');
  }
};