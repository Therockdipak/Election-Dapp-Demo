import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./contract/Election.json";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./App.css";

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidateCounts, setCandidateCounts] = useState(0);
  const [voted, setVoted] = useState(null);

  const connectToBlockchain = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contractAbi = abi.abi;

        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        setProvider(provider);
        setContract(contract);
        getCandidateCounts(contract);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Ethereum provider is not found");
    }
  };

  useEffect(() => {
    connectToBlockchain();
  }, []);

  const getCandidateCounts = async (contract) => {
    try {
      const counts = await contract.candidateCounts();
      setCandidateCounts(counts.toNumber());
    } catch (error) {
      console.error(error);
    }
  };

  const handleVote = async (candidateIndex) => {
    try {
      await contract.vote(candidateIndex);
      setVoted(candidateIndex);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1 className="mt-4 mb-4">Welcome to Election Dapp Demo</h1>
      {provider && contract ? (
        <div>
          <p className="mb-4">Total Candidates: {candidateCounts}</p>
          <p className="mb-4" bold>Status: {voted !== null ? "Voted" : "Not Voted"}</p>
          {voted === null ? (
            <div>
              <button className="btn btn-primary mr-2" onClick={() => handleVote(0)}>
                <i className="fa-solid fa-fish"></i> BJP
              </button>
              <p></p>
              <button className="btn btn-primary mr-2" onClick={() => handleVote(1)}>
                <i className="fa-solid fa-hand"></i> Congress
              </button>
              <p></p>
              <button className="btn btn-primary" onClick={() => handleVote(2)}>
                <i className="fa-solid fa-broom"></i> AAP
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <button className="btn btn-primary" onClick={connectToBlockchain}>Connect to blockchain</button>
      )}
    </div>
  );
}

export default App;
