import React, { useEffect, useState } from "react";
import { getData, postAddress, getConfig, getUserInfo, getContractBalance } from "./requests";
import { Blocks } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="w-[100%] h-full absolute z-[10] ">
       <div className="absolute right-[50%] top-[50%] z-[100]">
    <Blocks
  visible={true}
  height="80"
  width="80"
  ariaLabel="blocks-loading"
  wrapperStyle={{}}
  wrapperClass="blocks-wrapper"
/>
</div>
</div>
  )
}

const App = () => {
  const [calls, setCalls] = useState(null);
  const [address, setAddress] = useState("");
  const [payed, setPayed] = useState(null);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [minTime, setMinTime] = useState(null);
  const [isOkey, setIsOkey] = useState(null);

  const [loaderVisible, setLoaderVisible] = useState(true)


  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  useEffect(() => {
    getData(setCalls, setLoaderVisible);
    getConfig(setAmount, setMinTime, setLoaderVisible);
    getContractBalance(setBalance)

  }, []);

  return (
    <div className={`w-[100%] h-max py-[100px] grid gap-[30px] justify-center px-[24px] z-[1] ${loaderVisible === true && 'opacity-50'} `}>

      {loaderVisible === true ? <Loader/> : null}

      <h1 className="text-[22px] font-bold w-max h-max mx-auto text-gray-600 text-center px-[24px] sm:max-w-[350px] md:max-w-[450px]">
        tBNB BOOTCAMP FAUCET BY BLOCK BUSTERS TEAM
      </h1>

      <div className="grid">
        <p className="text-16 font-normal text-gray-600 w-max h-max mx-auto">
          Faucet Balance:
          <span className="font-bold ml-[12px]">{balance}</span>
        </p>
        <p className="text-16 font-normal text-gray-600 w-max h-max mx-auto">
          Faucet Amount:
          <span className="font-bold ml-[12px]">{amount +' BNB'}</span>
        </p>
        <p className="text-16 font-normal text-gray-600 w-max h-max mx-auto">
          Min time between requests:
          <span className="font-bold ml-[12px]">{secondsToHms(minTime)}</span>
        </p>
      </div>

      <div className="w-max h-max flex justify-between mx-auto sm:px-[24px]">
        <input
          type="text"
          className="w-[400px] md:w-[260px] sm:w-[260px] h-[44px] rounded-[6px] border border-1 border-gray-400 px-[12px] text-[16px] text-gray-500 focus:ring-0 focus:outline-none "
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        &nbsp;
        {payed === null ? (
          <button
            type=""
            className="w-ma xh-max bg-gray-400 text-white border-none rounded-[6px] px-[14px] py-[6px]"
            onClick={() => {
              if (address.length >= 42) {
                getUserInfo(address, setPayed, setLoaderVisible);
              }
            }}
          >
            Check
          </button>
        ) : (
          <>
            {payed.timeLeftUntilNextRequest === "0" || (balance > amount)? (
              <button
                type=""
                className="w-ma xh-max bg-gray-400 text-white border-none rounded-[6px] px-[14px] py-[6px]"
                onClick={() => {
                  if (address.length >= 42) {
                    postAddress(address, setIsOkey, setLoaderVisible);
                    getData(setCalls, setLoaderVisible)
                  }
                }}
              >
                Send
              </button>
            ) : (
              <button
                type=""
                className="w-ma xh-max bg-gray-400 text-white border-none rounded-[6px] px-[14px] py-[6px]"
                onClick={() => {

                }}
                disabled
              >
                Send
              </button>
            )}
          </>
        )}
      </div>
      {payed !== null ? (
        <div className="grid">
          <p className="text-16 font-normal text-gray-600 w-max h-max mx-auto">
            Is requested before:
            <span className="font-bold ml-[12px]">
              {payed.paidAddresses === true ? "true" : "false"}
            </span>
          </p>
          <p className="text-16 font-normal text-gray-600 h-max mx-auto text-center px-[24px] sm:max-w-[280px] md:max-w-[330px] whitespace-break-spaces">
            Time left until next request: {'\n'}      
            <span className="font-bold ml-[12px]">
              {` ` + secondsToHms(Number(payed.timeLeftUntilNextRequest))}
            </span>
          </p>
        </div>
      ) : null}

      {isOkey === true && (
        <p className="text-18 font-normal text-green-400 mx-auto w-max h-max ">
          Sent successfully
        </p>
      )}

      {calls !== null ? (
        <>
          <h1 className="text-gray-600 font-bold text-16 w-max h-max px-[24px]">
            Last 10 transactions
          </h1>
          <div className="grid gap-[30px] justify-center">
            {calls.map((item, index) => (
              <div
                className="w-max md:max-w-[320px] sm:max-w-[320px] mx-auto h-max border border-1 border-gray-500 h-max p-[24px] rounded-[10px] text-ellipsis"
                key={index}
              >
                <h1 className="text-16 font-normal text-gray-600 w-max h-max ">
                  Hash:
                </h1>
                <a
                  href={`https://testnet.bscscan.com/tx/${item.transaction.hash}`}
                  target="blank"
                >
                  <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                    {item.transaction.hash}
                  </p>
                </a>

                <h1 className="text-16 font-normal text-gray-600">
                  {new Date(item.block.timestamp.iso8601).toUTCString()}
                </h1>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default App;
