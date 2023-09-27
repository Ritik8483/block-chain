import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Services from "./components/Services";
import Transactions from "./components/Transactions";
import Welcome from "./components/Welcome";

function App() {
  return (
    <>
      <div className="min-h-screen">
        <div className="gradient-bg-welcome">
          <Navbar />
          <Welcome />
        </div>
        <Services />
        <Transactions />
        <Footer />
      </div>
    </>
  );
}

export default App;

//hadhat allows us to run solidity locally
//solidity is a programming language used for etherium block chain
//hardhat-wafffle plugin to build smart contract
//create two folders inside a new folder namely client and smart_contract
//now cd client and create react app inside your client folder and also intall npm install ethers@5.7.2 --save-dev
//cd smart_contract and create your packagae.json using npm init -y
//Install all the pacakages in devDependencies
//npm install --save-dev hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
//npx hardhat (creates a basic structure) 
//npm install --save-dev "hardhat@^2.17.1" "@nomicfoundation/hardhat-toolbox@^3.0.0"
// then write npx hardhat test (run out test script)
// npm install --save-dev "@nomicfoundation/hardhat-network-helpers@^1.0.0" "@nomicfoundation/hardhat-chai-matchers@^2.0.0" "@nomicfoundation/hardhat-ethers@^3.0.0" "@nomicfoundation/hardhat-verify@^1.0.0" "@types/chai@^4.2.0" "@types/mocha@>=9.1.0" "@typechain/ethers-v6@^0.4.0" "@typechain/hardhat@^8.0.0" "hardhat-gas-reporter@^1.0.8" "solidity-coverage@^0.8.1" "ts-node@>=8.0.0" "typescript@>=4.5.0"
//npm install ethers@5.7.2 --save-dev  (Downgrade ether version as it's unstable)

//after writin transactions.sol , deploy.js and hardhat.js
//use npx hardhat run scripts/deploy.js --network sepolia  [used to deploy contract,it creates some folder where transactions.js is your abi]
