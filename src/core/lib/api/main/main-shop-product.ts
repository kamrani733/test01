'use server';

import { AxiosError } from 'axios';

import { api } from '..';

export const getCategories = async () => {
  try {
    const { data } = await api.get('/api/categories');
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data;
    }
  }
};

export const getProductsByCategory = async (
  slug: string = 'all',
  page = 1,
  perPage = 10
) => {
  try {
    const { data } = await api.get(`/api/categories/products/${slug}`, {
      params: { perPage, page },
    });
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data;
    }
  }
};

export const getSliderByCategory = async (slug: string = 'all') => {
  try {
    const { data } = await api.get(`/api/categories/slider/${slug}`);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data;
    }
  }
};

export const getProductById = async (id: number) => {
  try {
    const result = await api.get(`/api/products/${id}`);
    return result.data.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data;
    }
  }
};

export const getProductGalleryById = async (id: number) => {
  try {
    const result = await api.get(`/api/products/gallery/${id}`);
    return result.data.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data;
    }
  }
};

export const getRelatedProductsById = async (id: number) => {
  try {
    const result = await api.get(`/api/products/related_products/${id}`);
    return result.data.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data;
    }
  }
};

export const getCommentProductsById = async (id: number) => {
  try {
    const result = await api.get(`/api/products/comments/${id} `);
    return result.data.data.comments.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data;
    }
  }
};

export const postCommentProductById = async (
  productId: number,
  payload: { content?: string }
) => {
  try {
    const res = await api.post(`/api/products/comments/${productId}`, payload);

    // فقط بعد از POST کش invalidate میشه

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data;
    }
    throw error;
  }
};
export const getProductColorsById = async (id: number) => {
  try {
    const result = await api.get(`/api/products/colors/${id}`);
    return result.data.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data;
    }
  }
};

export const getFeaturedProducts = async (limit: number = 6) => {
  try {
    const { data } = await api.get('/api/products/featured', {
      params: { limit },
    });
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data;
    }
    // Fallback: get products from 'all' category if featured endpoint doesn't exist
    try {
      const { data } = await api.get('/api/categories/products/all', {
        params: { perPage: limit, page: 1 },
      });
      return data;
    } catch (fallbackError) {
      if (fallbackError instanceof AxiosError && fallbackError.response) {
        return fallbackError.response.data;
      }
      return { data: { data: [] } };
    }
  }
};
