import axios from "axios";
var qs = require("qs");

export const getData = (setCalls, setLoaderVisible) => {
  setLoaderVisible(true);
  var data = JSON.stringify({
    query:
      'query ($network: EthereumNetwork!, $limit: Int!, $offset: Int!, $contract: String!, $method: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\n  ethereum(network: $network) {\n    smartContractCalls(\n      options: {desc: "block.timestamp.iso8601", limit: $limit, offset: $offset}\n      smartContractAddress: {is: $contract}\n      smartContractMethod: {is: $method}\n      date: {since: $from, till: $till}\n    ) {\n      block {\n        timestamp {\niso8601\n        }\n        height\n      }\n      address: caller {\n        address\n        annotation\n      }\n    \n      smartContractMethod {\n        name\n        signatureHash\n      }\n      smartContract {\n        address {\n          address\n          annotation\n        }\n      }\n      transaction {\n        hash\n      }\n      external\n      gasValue\n    }\n  }\n}\n',
    variables:
      '{\n  "limit": 10,\n  "offset": 0,\n  "network": "bsc_testnet",\n  "contract": "0xfaf06c04b9f64e5a13305e191739b01b92f6bffe",\n  "caller": "",\n  "method": "2a707541",\n  "from": "2023-03-13",\n  "dateFormat": "%Y-%m-%d"\n}',
  });
  const apiKey = process.env.REACT_APP_API_KEY;

  var config = {
    method: "post",
    url: "https://graphql.bitquery.io",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      const arr = response.data.data.ethereum.smartContractCalls;
      setCalls(arr);
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const getConfig = (setAmount, setMinTime, setLoaderVisible) => {
  setLoaderVisible(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${apiUrl}api/v1/info`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  axios(config)
    .then(function (response) {
      setAmount(response.data.faucetAmount);
      setMinTime(response.data.minTimeBetweenRequests);
      setLoaderVisible(false);
    })
    .catch(function (error) {
      console.log(error);
      setLoaderVisible(false);
    });
};

export const getUserInfo = (address, setPayed, setLoaderVisible) => {
  setLoaderVisible(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${apiUrl}api/v1/action?address=${address}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  axios(config)
    .then(function (response) {
      setPayed(response.data);
      setLoaderVisible(false);
    })
    .catch(function (error) {
      setLoaderVisible(false);
      console.log(error);
    });
};

export const postAddress = (address, setIsOkey, setLoaderVisible) => {
  setLoaderVisible(true);
  var data = qs.stringify({
    address: address,
  });
  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.REACT_APP_API_URL}api/v1/action`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      setIsOkey(true);
      setLoaderVisible(false);
    })
    .catch(function (error) {
      console.log(error);
      setLoaderVisible(false);
    });
};

export const getContractBalance = (setBalance) => {
  var data = JSON.stringify({
    query:
      '{\n  ethereum(network: bsc_testnet) {\n    address(address: {is: "0xFAf06C04b9f64e5A13305e191739b01b92F6BFFe"}) {\n      balances{\n        currency{\n          symbol\n        }\n        value\n      }\n    }\n  }\n}\n',
    variables: "{}",
  });

  const apiKey = process.env.REACT_APP_API_KEY;

  var config = {
    method: "post",
    url: "https://graphql.bitquery.io",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      setBalance(
        response.data.data.ethereum.address[0].balances[0].value.toFixed(3) +
          " " +
          response.data.data.ethereum.address[0].balances[0].currency.symbol
      );
    })
    .catch(function (error) {
      console.log(error);
    });
};
