import { environment } from '../environments/environment';
import axios from 'axios'

let cacheData = {};

export const fetchStocks = async (req,res)  => {

  const { stockType, stcokPeriod } = req.params;
  const { token } = req.query;

  const key = `${stockType}:${stcokPeriod}`;

  const stocksApi = `${environment.apiURL}/beta/stock/${stockType}/chart/${
    stcokPeriod
  }?token=${environment.apiKey}`

  if(cacheData[key]) {
    return cacheData[key];
  }

  try {
    const response: any =  await axios.get(stocksApi);
    cacheData[key] = response.data
    return response.data;
  } catch (error) {
    console.log(error)
  }
  return null;
}