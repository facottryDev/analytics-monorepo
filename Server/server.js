import express from 'express';
import cors from 'cors';
import { dataOptions, data } from './data.js';

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/data-options', (req, res) => {
  res.json(dataOptions);
});

app.get('/api/data', (req, res) => {
  const {
    countries,
    subscriptions,
    os,
    osVersions,
    modelNames,
    plans,
    states
  } = req.query;

  const response = {};

  if (countries) {
    const countryList = countries.split(',');
    response.countries = {};
    countryList.forEach(country => {
      response.countries[country] = data.countries[country];
    });
  }

  if (subscriptions) {
    const subscriptionList = subscriptions.split(',');
    response.subscriptions = {};
    subscriptionList.forEach(sub => {
      response.subscriptions[sub] = data.subscriptions[sub];
    });
  }

  if (os) {
    const osList = os.split(',');
    response.os = {};
    osList.forEach(osItem => {
      response.os[osItem] = data.os[osItem];
    });
  }

  if (osVersions) {
    const osVersionList = osVersions.split(',');
    response.osVersions = {};
    osVersionList.forEach(osVersion => {
      response.osVersions[osVersion] = data.osVersions[osVersion];
    });
  }

  if (modelNames) {
    const modelNameList = modelNames.split(',');
    response.modelNames = {};
    modelNameList.forEach(modelName => {
      response.modelNames[modelName] = data.modelNames[modelName];
    });
  }

  if (plans) {
    const planList = plans.split(',');
    response.plans = {};
    planList.forEach(plan => {
      response.plans[plan] = data.plans[plan];
    });
  }

  if (states) {
    const stateList = states.split(',');
    response.states = {};
    stateList.forEach(state => {
      response.states[state] = data.states[state];
    });
  }

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
