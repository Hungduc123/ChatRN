import axios from "axios";
export const getCountries = async () =>
  await axios.get("https://api.covid19api.com/countries");

export const getReportByCountry = (country: any) =>
  axios.get(`https://api.covid19api.com/dayone/country/${country}`);
export const getCity = async () =>
  await axios.get(
    "https://api.apify.com/v2/key-value-stores/p3nS2Q9TUn6kUOriJ/records/LATEST?fbclid=IwAR2z0CNP800VROYbKBx5fmhBxOxYKRYMFT1vtWch7D7-C8GfQ_-QV7L1kS4"
  );
export const getDetail = async () =>
  await axios.get(
    "https://api.apify.com/v2/key-value-stores/ZsOpZgeg7dFS1rgfM/records/LATEST?fbclid=IwAR1Qh5Jnu5gb55avw3MNlglCW570VIagVUHBP0_Mxij4kEPD7guQH6rg6yI"
  );
export const getDataChart = async () =>
  await axios.get(
    "https://api.apify.com/v2/key-value-stores/Tksmptn5O41eHrT4d/records/LATEST"
  );
export const getData = async () =>
  await axios.get("https://corona-api.com/countries?include=timeline");
