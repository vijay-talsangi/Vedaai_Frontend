import type { Assignment, CreateAssignmentPayload } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({
      message: 'An unknown error occurred',
    }));
    throw new ApiError(
      errorBody.message || `Request failed with status ${response.status}`,
      response.status
    );
  }

  return response.json() as Promise<T>;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface BackendPaginatedAssignments {
  data: Assignment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse {
  assignments: Assignment[];
  total: number;
  page: number;
  totalPages: number;
}

export const api = {
  createAssignment: (data: CreateAssignmentPayload): Promise<Assignment> =>
    request<ApiEnvelope<Assignment>>('/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((response) => response.data),

  getAssignments: (
    page = 1,
    limit = 10,
    search = ''
  ): Promise<PaginatedResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.set('search', search);
    return request<ApiEnvelope<BackendPaginatedAssignments>>(
      `/assignments?${params.toString()}`
    ).then((response) => ({
      assignments: response.data.data,
      total: response.data.total,
      page: response.data.page,
      totalPages: response.data.totalPages,
    }));
  },

  getAssignment: (id: string): Promise<Assignment> =>
    request<ApiEnvelope<Assignment>>(`/assignments/${id}`).then(
      (response) => response.data
    ),

  deleteAssignment: (id: string): Promise<{ message: string }> =>
    request<ApiEnvelope<{ message: string }>>(`/assignments/${id}`, {
      method: 'DELETE',
    }).then((response) => response.data),
};
