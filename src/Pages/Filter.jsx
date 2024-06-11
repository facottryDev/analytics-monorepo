/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import Cards from "../Components/Card";
import Checkboxes from "../Components/Checkboxes";
import ShowFields from "../Components/ShowFields";

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

  const [showFields, setShowFields] = useState([
    { value: 'showCountryData', label: 'Show Country Data', checked: false },
    { value: 'showSubscriptionData', label: 'Show Subscription Data', checked: false },
    { value: 'showOSData', label: 'Show OS Data', checked: false },
    { value: 'showOSVersionData', label: 'Show OS Version Data', checked: false },
    { value: 'showModelNameData', label: 'Show Model Name Data', checked: false },
    { value: 'showPlanData', label: 'Show Plan Data', checked: false },
    { value: 'showStateData', label: 'Show State Data', checked: false },
  ]);

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

  const handleFieldChange = (fieldValue) => {
    setShowFields((prevFields) =>
      prevFields.map((field) =>
        field.value === fieldValue ? { ...field, checked: !field.checked } : field
      )
    );
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

    showFields.forEach((field) => {
      if (!field.checked) delete filters[field.value.replace('show', '').toLowerCase()];
    });

    Object.keys(filters).forEach((key) => {
      const filterString = filters[key].map((option) => option.value).join(",");
      if (filterString) query.append(key, filterString);
    });

    const response = await fetch(
      `http://localhost:5000/api/data?${query.toString()}`
    );
    const result = await response.json();
    setResult({
      data: result,
      filters: {
        showCountryData: showFields.find(field => field.value === 'showCountryData').checked,
        showSubscriptionData: showFields.find(field => field.value === 'showSubscriptionData').checked,
        showOSData: showFields.find(field => field.value === 'showOSData').checked,
        showOSVersionData: showFields.find(field => field.value === 'showOSVersionData').checked,
        showModelNameData: showFields.find(field => field.value === 'showModelNameData').checked,
        showPlanData: showFields.find(field => field.value === 'showPlanData').checked,
        showStateData: showFields.find(field => field.value === 'showStateData').checked,
      }
    });
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
      <div className="flex flex-col gap-10 mt-10">
        <div className="grid grid-cols-4 gap-10">
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
        <div className="grid grid-cols-3 gap-10">
          <Checkboxes
            label="Model Names"
            options={dataOptions.modelNames}
            selectedOptions={selectedModelNames}
            handleChange={handleCheckboxChange(
              setSelectedModelNames,
              selectedModelNames
            )}
          />
          <Checkboxes
            label="Plans"
            options={dataOptions.plans}
            selectedOptions={selectedPlans}
            handleChange={handleCheckboxChange(setSelectedPlans, selectedPlans)}
          />
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
      <div className="flex flex-col gap-10 mt-10">
        <div className="flex gap-10">
          <ShowFields fields={showFields} handleFieldChange={handleFieldChange} />
        </div>
      </div>
      <div className="py-12">
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
        {result && (
          <Cards
            result={result.data}
            showCountryData={result.filters.showCountryData}
            showSubscriptionData={result.filters.showSubscriptionData}
            showOSData={result.filters.showOSData}
            showOSVersionData={result.filters.showOSVersionData}
            showModelNameData={result.filters.showModelNameData}
            showPlanData={result.filters.showPlanData}
            showStateData={result.filters.showStateData}
          />
        )}
      </div>
    </div>
  );
};

export default Filters;
