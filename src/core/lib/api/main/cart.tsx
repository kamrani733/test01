'use server';

import axios from 'axios';

import { api, getCsrfToken } from '..';

export interface CartItem {
  product_id: number;
  quantity: number;
}

export interface Cart {
  uuid?: string;
  items: CartItem[];
}

export const getCart = async (uuid?: string) => {
  try {
    await getCsrfToken();
    const { data } = await api.get(`api/carts${uuid}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const addToCart = async (cartData: {
  product_id: number;
  quantity: number;
  uuid?: string;
}) => {
  try {
    await getCsrfToken();
    const { data } = await api.post('api/carts/add', cartData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const updateCartItem = async (cartData: {
  product_id: number;
  quantity: number;
  uuid?: string;
}) => {
  try {
    await getCsrfToken();
    const { data } = await api.put('api/carts/update', cartData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const removeFromCart = async (cartData: {
  product_id: number;
  uuid?: string;
}) => {
  try {
    await getCsrfToken();
    const { data } = await api.delete('api/carts', { data: cartData });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const syncLocalCartToBackend = async (cart: Cart) => {
  try {
    await getCsrfToken();
    const { data } = await api.post('api/carts/sync', cart);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
