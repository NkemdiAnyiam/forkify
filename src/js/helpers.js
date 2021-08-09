'use strict';

import { async } from 'regenerator-runtime';
// import 'regenerator-runtime/runtime';
import {TIMEOUT_SECONDS} from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const wait = s => new Promise(resolve => setTimeout(resolve, s * 1000));


export const AJAX = async function (url, uploadData = undefined) { // conditionally GET or POST
  try {
    const fetchPromise = fetch(url, uploadData && {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData)
    });

    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();

    if (!res.ok) { throw new Error(`${data.message} (${res.status})`); }
    return data;
  }
  catch(err) {
    throw err;
  }
};

/*
export const fetchAndConvert = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();

    if (!res.ok) { throw new Error(`${data.message} (${res.status})`); }
    return data;
  }
  catch(err) {
    throw err;
  }
};

export const convertAndSend = async function (url, uploadRecipe) {
  try {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadRecipe)
    };

    const res = await Promise.race([fetch(url, fetchOptions), timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();

    if (!res.ok) { throw new Error(`${data.message} (${res.status})`); }
    return data;
  }
  catch(err) {
    throw err;
  }
};
*/
