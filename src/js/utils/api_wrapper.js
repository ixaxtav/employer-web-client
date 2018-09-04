/* global localStorage, fetch */
import {logout} from '../actions';
import {Session} from 'bc-react-session';

const rootAPIendpoint = process.env.apiHost+'/api';

let HEADERS = {
  'Content-Type': 'application/json'
};

// TODO: implemente a queue for requests and status, also avoid calling the same request twice
let pending_requests = [];
const log = (error) => (process.env.DEBUG == 'true') ? console.error(error) : '';

const getToken = () => {
  if (Session) {
    const token = Session.store.getSession().access_token;
    return token;
  }
  return null;
};

const appendCompany = (data) => {
  if (Session && data) {
    data.employer = Session.store.getSession().user.profile.employer;
    return data;
  }
};

/* AVAILABLE MODELS
  - badges
  - employees
  - employers
  - favlists
  - positions
  - profiles
  - shifts
  - venues
  - oauth/token (generate token)
  - tokenuser (get user data from local saved token)
*/

/**
 * Fetch JSON from API through GET method
 * @param {string} model Model data to be fetched. **Must be plural**
 * @returns {data}
 */
export const GET = async (endpoint, queryString = null, extraHeaders = {}) => {
  let url = `${rootAPIendpoint}/${endpoint}`;
  if(queryString) url += queryString;
  
  const response = fetch(url, {
    method: 'GET',
    headers: new Headers({
      ...HEADERS,
      ...extraHeaders,
      Authorization: `JWT ${getToken()}`
    })
  })
  .then((resp) => processResp(resp))
  .catch(err => {
      if (typeof err == 'string') throw new Error(err);
      log(err);
  });
  return response;
};

export const POST = (endpoint, postData, extraHeaders = {}) => {
  
  if(['register', 'login'].indexOf(endpoint) == -1){
    HEADERS['Authorization'] = `JWT ${getToken()}`;
    postData = appendCompany(postData);
  } 
  const REQ = {
    method: 'POST',
    headers: Object.assign(HEADERS,extraHeaders),
    body: JSON.stringify(postData)
  };
  
  const response = fetch(`${rootAPIendpoint}/${endpoint}`, REQ)
    .then((resp) => processResp(resp))
    .catch(err => {
      if (typeof err == 'string') throw new Error(err);
      log(err);
    });
  // if (data.detail) {
  //   logout();
  //   return 0;
  // }
  return response;
};

export const PUT = (endpoint, putData, extraHeaders = {}) => {
  
  if(['register', 'login'].indexOf(endpoint) == -1){
    HEADERS['Authorization'] = `JWT ${getToken()}`;
  } 
  const REQ = {
    method: 'PUT',
    headers: Object.assign(HEADERS,extraHeaders),
    body: JSON.stringify(putData)
  };
  
  const response = fetch(`${rootAPIendpoint}/${endpoint}`, REQ)
    .then((resp) => processResp(resp))
    .then((data) => {
      if (data.detail) {
        logout();
        return 0;
      }
      return data;
    })
    .catch(err => {
      if (typeof err == 'string') throw new Error(err);
      log(err);
    });
  
  return response;
};

export const DELETE = (endpoint, extraHeaders = {}) => {
  
  HEADERS['Authorization'] = `JWT ${getToken()}`;
  
  const REQ = {
    method: 'DELETE',
    headers: Object.assign(HEADERS,extraHeaders)
  };
  
  const response = fetch(`${rootAPIendpoint}/${endpoint}`, REQ)
    .then((resp) => processResp(resp))
    .then((data) => {
      if (data.detail) {
        logout();
        return 0;
      }
      return data;
    })
    .catch(err => {
      if (typeof err == 'string') throw new Error(err);
      log(err);
    });
  
  return response;
};

const processResp = (resp) => {
  if(resp.status == 200) return resp.json();
  else if(resp.status == 400) throw new Error(parseError(resp));
  else if(resp.status == 404) throw new Error('Not found');
  else if(resp.status == 503){
    logout();
    throw new Error('The JobCore API seems to be unavailable');
  } 
  else if(resp.status == 401){
    logout();
    throw new Error('You are not authorized for this action');
  } 
  else if(resp.status > 200 && resp.status < 300) return resp.json();
  else if(resp.status >= 500 && resp.status < 600) throw new Error('Something bad happened while completing your request! Please try again later.');
  else return resp.json();
};

const parseError = (error) => {
  const json = error.json();
  let errorMsg = '';
  for(let type in json){
    errorMsg += json[type].join(',');
  }
  return errorMsg;
};