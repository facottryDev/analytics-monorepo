/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import Cards from "../Components/Card";
import Checkboxes from "../Components/Checkboxes";

const Filters = () => {
  const [dataOptions, setDataOptions] = useState({
    countries: [],
    subscriptions: [],
    os: [],
    osVersions: [],
    modelNames: [],
    plans: [],
    states: [],
  });

  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
  const [selectedOS, setSelectedOS] = useState([]);
  const [selectedOSVersions, setSelectedOSVersions] = useState([]);
  const [selectedModelNames, setSelectedModelNames] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);

  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchDataOptions = async () => {
      const response = await fetch("http://localhost:5000/api/data-options");
      const data = await response.json();
      setDataOptions(data);
    };

    fetchDataOptions();
  }, []);

  const handleCheckboxChange = (setter, selectedOptions) => (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    setter((prev) => {
      if (isChecked) {
        return [...prev, { value }];
      } else {
        return prev.filter((option) => option.value !== value);
      }
    });
  };

  const handleFilter = async () => {
    const query = new URLSearchParams();

    const filters = {
      countries: selectedCountries,
      subscriptions: selectedSubscriptions,
      os: selectedOS,
      osVersions: selectedOSVersions,
      modelNames: selectedModelNames,
      plans: selectedPlans,
      states: selectedStates,
    };

    Object.keys(filters).forEach((key) => {
      const filterString = filters[key].map((option) => option.value).join(",");
      if (filterString) query.append(key, filterString);
    });

    const response = await fetch(
      `http://localhost:5000/api/data?${query.toString()}`
    );
    const result = await response.json();
    setResult(result);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between my-10">
        <h1 className="text-2xl font-bold mb-4">Filter Data</h1>
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
      <div className="flex justify-center gap-10 mt-10">
        <Checkboxes
          label="Countries"
          options={dataOptions.countries}
          selectedOptions={selectedCountries}
          handleChange={handleCheckboxChange(
            setSelectedCountries,
            selectedCountries
          )}
        />
        <Checkboxes
          label="Subscriptions"
          options={dataOptions.subscriptions}
          selectedOptions={selectedSubscriptions}
          handleChange={handleCheckboxChange(
            setSelectedSubscriptions,
            selectedSubscriptions
          )}
        />
        <Checkboxes
          label="Operating Systems"
          options={dataOptions.os}
          selectedOptions={selectedOS}
          handleChange={handleCheckboxChange(setSelectedOS, selectedOS)}
        />
        <Checkboxes
          label="OS Versions"
          options={dataOptions.osVersions}
          selectedOptions={selectedOSVersions}
          handleChange={handleCheckboxChange(
            setSelectedOSVersions,
            selectedOSVersions
          )}
        />
      </div>
      <div className="flex justify-center">
        <div className="mx-12">
          <Checkboxes
            label="Model Names"
            options={dataOptions.modelNames}
            selectedOptions={selectedModelNames}
            handleChange={handleCheckboxChange(
              setSelectedModelNames,
              selectedModelNames
            )}
          />
        </div>
        <div className="mx-12">
          <Checkboxes
            label="Plans"
            options={dataOptions.plans}
            selectedOptions={selectedPlans}
            handleChange={handleCheckboxChange(setSelectedPlans, selectedPlans)}
          />
        </div>
        <div className="mx-12">
          <Checkboxes
            label="States"
            options={dataOptions.states}
            selectedOptions={selectedStates}
            handleChange={handleCheckboxChange(
              setSelectedStates,
              selectedStates
            )}
          />
        </div>
      </div>
      <div className="mt-12 py-12">
        {selectedCountries.length === 0 &&
          selectedSubscriptions.length === 0 &&
          selectedOS.length === 0 &&
          selectedOSVersions.length === 0 &&
          selectedModelNames.length === 0 &&
          selectedPlans.length === 0 &&
          selectedStates.length === 0 &&
          !result && (
            <div className="text-center text-gray-500">
              <h2 className="text-xl font-semibold">Welcome to Analytics</h2>
              <p>Please choose the data you would like to view.</p>
            </div>
          )}
        {result && <Cards result={result} />}
      </div>
    </div>
  );
};

export default Filters;
