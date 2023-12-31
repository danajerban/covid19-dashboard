import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import LineChart from "./LineChart";
import PieChart from "./PieChart";

function CountryPage() {
  const { countryId } = useParams();
  const [data, setData] = useState(null);
  const [totalData, setTotalData] = useState(null);

// for a better reference we are using the countryId from the url params
// and then fetch the data from backend using that countryId (all covid data for line chart include dates, and just total numbers for pie chart)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_LOCAL_URL}/search/${countryId}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchData();
  }, [countryId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_LOCAL_URL}/search/totals/${countryId}`
        );
        setTotalData(response.data);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchData();
  }, [countryId]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-xl font-bold mb-4 text-center w-full text-gray-700">
        Daily Trends for {totalData?.country?.name}
      </h1>
      <div className="flex justify-center w-full mb-16">
        {data && <LineChart data={data} />}
      </div>
      <h1 className="text-xl font-bold mb-4 text-center w-full text-gray-700">
        Complete statistics for {totalData?.country?.name} from 22 Jan, 2020 to 27, Aug 2020
      </h1>
      <div className="flex justify-center w-full mb-4">
        {totalData && <PieChart totalData={totalData} />}
      </div>
    </div>
  );
}

export default CountryPage;
