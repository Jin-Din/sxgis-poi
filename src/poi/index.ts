import axios, { AxiosResponse } from "axios";
import { useAwaitHelper } from "../utils";
interface ISOption {
  url: string;
}
// #region  Poi

export interface ISPOIRespone {
  // code?: string;
  // message?: string;
}
export interface ISPOIError {
  code?: string;
  message?: string;
}
export interface ISPoiResult {
  code?: string;
  message?: string;
  featuresTotal: number;
  features: ISPoiResultItem[];
}
export interface ISPoiResultItem extends Record<string, any> {
  NAME?: string;
  ADDRESS?: string;
  TELEPHONE?: string;
  TYPE2018?: string;
  coor?: [number, number];
}
interface ISSearchParams {
  keyword?: string;
  searchField?: string;
  outFields?: string;
  f?: string;
}
export interface ISPoiSearchParams extends ISSearchParams {
  keyword: string;
  pageIndex?: number;
  pageSize?: number;
  returnGeometry?: boolean;
}
export interface ISPoiSuggestParams extends ISSearchParams {
  keyword: string;
  recordSize?: number;
}
export interface ISPoiNearbyParams {
  keyword?: string;
  type?: string;
  centerAt: string;
  radius: number;
  searchFields?: string;
  pageIndex?: number;
  pageSize?: number;
  returnGeometry?: boolean;
  outFields?: string;
  f?: string;
}
export interface ISPoiNearbyKeywordParams extends ISPoiNearbyParams {
  keyword: string;
}
export interface ISPoiNearbyThemeParams extends ISPoiNearbyParams {
  type: string;
}
// #endregion

const defaultSearchParams: ISPoiSearchParams = {
  keyword: "",
  searchField: "NAME",
  outFields: "NAME",
  pageSize: 10,
  pageIndex: 1,
  returnGeometry: true,
  f: "json",
};
export const usePOI = (url: string) => {
  const baseUrl = url;

  const getData = async (searchUrl: string, params: any) => {
    return new Promise<ISPoiResult>(async (resolve, reject) => {
      let [error, result] = await useAwaitHelper(axios.get(searchUrl, { params }));
      if (result) {
        let poiResult = result.data as ISPoiResult;
        if (poiResult.code) {
          reject(poiResult as ISPOIError);
        } else resolve(poiResult);
      }
      if (error) {
        let axioRespone = error as AxiosResponse;
        reject({
          code: axioRespone.status,
          message: axioRespone.statusText,
        } as unknown as ISPOIError);
      }
    });
  };
  const fuzzy = async (searchParams: ISPoiSearchParams) => {
    let searchUrl = baseUrl.endsWith("fuzzy") ? baseUrl : `${baseUrl}/fuzzy`;

    let params = { ...defaultSearchParams, ...searchParams };
    let [error, result] = await useAwaitHelper(axios.get(searchUrl, { params }));
    return new Promise<ISPoiResult>((resolve, reject) => {
      if (result) {
        let poiResult = result.data as ISPoiResult;
        if (poiResult.code) {
          reject(poiResult as ISPOIError);
        } else resolve(poiResult);
      }
      if (error) {
        let axioRespone = error as AxiosResponse;
        reject({
          code: axioRespone.status,
          message: axioRespone.statusText,
        } as unknown as ISPOIError);
      }
    });
  };
  const suggest = async (searchParams: ISPoiSuggestParams) => {
    let suggestUrl = baseUrl.endsWith("suggest") ? baseUrl : `${baseUrl}/suggest`;
    let params = { ...{ outFields: "NAME", recordSize: 5, f: "json" }, ...searchParams };
    let [error, result] = await useAwaitHelper(axios.get(suggestUrl, { params }));
    return new Promise<ISPoiResult>((resolve, reject) => {
      if (result) {
        let poiResult = result.data as ISPoiResult;
        if (poiResult.code) {
          reject(poiResult);
        } else resolve(poiResult);
      }
      if (error) {
        // console.log(error);
        let axioRespone = error as AxiosResponse;
        reject({
          code: axioRespone.status,
          message: axioRespone.statusText,
        });
      }
    });
  };
  const nearby = async (searchParams: ISPoiNearbyKeywordParams | ISPoiNearbyThemeParams) => {
    let searchUrl = baseUrl.endsWith("nearby") ? baseUrl : `${baseUrl}/nearby`;

    let defaultParams = {
      // searchFields: "NAME",
      // outFields: "NAME",
      pageSize: 10,
      pageIndex: 1,
      returnGeometry: true,
      f: "json",
    };
    //
    let params = { ...defaultParams, ...searchParams };

    return getData(searchUrl, params);
  };
  return {
    fuzzy,
    suggest,
    nearby,
  };
};
