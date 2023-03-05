import axios, { AxiosError } from "axios";
import API_PATHS, { PRODUCTS_API_PATH } from "~/constants/apiPaths";
import { AvailableProduct } from "~/models/Product";
import { useQuery, useQueryClient, useMutation } from "react-query";
import React from "react";

export function useAvailableProducts() {
  return useQuery<AvailableProduct[], AxiosError>(["available-products"], async () => {
    const res = await axios.get<{ products: AvailableProduct[] }>(
      `${PRODUCTS_API_PATH.path}/products`,
    );
    return res.data.products;
  });
}

export function useInvalidateAvailableProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("available-products", { exact: true }),
    []
  );
}

export function useAvailableProduct(id?: string) {
  return useQuery<AvailableProduct, AxiosError>(
    ["product", { id }],
    async () => {
      const res = await axios.get<{ product: AvailableProduct }>(
        `${PRODUCTS_API_PATH.path}/products/${id}`
      );
      return res.data.product;
    },
    { enabled: !!id }
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) =>
      queryClient.removeQueries(["product", { id }], { exact: true }),
    []
  );
}

export function useUpsertAvailableProduct() {
  return useMutation((values: AvailableProduct) =>
    axios.post<AvailableProduct>(`${PRODUCTS_API_PATH.path}/products`, values, )
  );
}

export function useDeleteAvailableProduct() {
  return useMutation((id: string) =>
    axios.delete(`${API_PATHS.bff}/product/${id}`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}
