import { useEffect, useState } from "react";
import faucetContract from "./ethereum/faucet";
import "./App.css";
const {ethers} = require("ethers");
function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer , setSigner] = useState()
  const [fcContract,setFcContract] = useState()
  const [withdrawError,setWithdrawError] = useState("")
  const [withdrawSuccess,setWithdrawSuccess] = useState("")
  const [transactionData,setTransactionData] = useState("")

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        /* get accounts */
        const accounts = await provider.send("eth_requestAccounts", []);
        /* get signer */
        setSigner(provider.getSigner());
        /* local contract instance */
        setFcContract(faucetContract(provider));
        /* set active wallet address */
        setWalletAddress(accounts[0]);

        
       
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
              //get provider
              const provider = new ethers.providers.Web3Provider(window.ethereum)
              //get accounts
              const accounts = await provider.send("eth_accounts",[])
              //get signer
              
              if (accounts.length > 0) {
          setSigner(provider.getSigner());
          setFcContract(faucetContract(provider));
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };



const getHKYHandler = async() =>{
  setWithdrawError("")
  setWithdrawSuccess("")
  try{
    const fcContractWithSigner = fcContract.connect(signer);
    const resp = await fcContractWithSigner.requestTokens();
    console.log(resp);
    setWithdrawSuccess("Transaction Successful");
    setTransactionData(resp.hash)
  }catch(err){
    console.log(err)
    setWithdrawError(err.message);
  }
}

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">🐺(HKY)</h1>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center">
              <button
                className="button is-white connect-wallet"
                onClick={connectWallet}
              >
                <span className="is-link has-text-weight-bold">
                  {walletAddress && walletAddress.length > 0
                    ? `Connected: ${walletAddress.substring(
                        0,
                        6
                      )}...${walletAddress.substring(38)}`
                    : "Connect Wallet"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <h1 className="title is-1"> Husky Faucet 🐺</h1>
            
            <p>Fast and reliable. 50 HKY/day.</p>
            <div className="mt-5">
              {withdrawError && (
                <div className="withdraw-error">{withdrawError}</div>
              )}
            </div>
            <div className="mt-5">
              {withdrawSuccess && (
                <div className="withdraw-success">{withdrawSuccess}</div>
              )}{" "}
            </div>
            <div className="box address-box">
              <div className="columns">
                <div className="column is-four-fifths">
                  <input
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                    defaultValue={walletAddress}
                  />
                </div>
                <div className="column">
                  <button className="button is-link is-medium" 
                  onClick={getHKYHandler}
                  disabled ={walletAddress ? false : true}
                  > 
                    GET TOKENS
                  </button>
                </div>
              </div>
              <article className="panel is-grey-darker">
                <p className="panel-heading">Transaction Data</p>
                
                <div className="panel-block">
                  <p> 
                    {transactionData ? `Transaction hash: ${transactionData}` : "--"}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
