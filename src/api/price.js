import { ethers, getNetworkId, getNetworkProviderUrl } from '@ansdomain/ui'
import getENS, { getRegistrar } from 'apollo/mutations/ens'

const ChainLinkABI = `[
  {
    "inputs": [
      {
        "internalType": "contract AggregatorInterface",
        "name": "_usdOracle",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "_rentPrices",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "oracle",
        "type": "address"
      }
    ],
    "name": "OracleChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "prices",
        "type": "uint256[]"
      }
    ],
    "name": "RentPriceChanged",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "expires",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      }
    ],
    "name": "premium",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "expires",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      }
    ],
    "name": "price",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "rentPrices",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract AggregatorInterface",
        "name": "_usdOracle",
        "type": "address"
      }
    ],
    "name": "setOracle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "_rentPrices",
        "type": "uint256[]"
      }
    ],
    "name": "setPrices",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceID",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "usdOracle",
    "outputs": [
      {
        "internalType": "contract AggregatorInterface",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]`

async function getContract() {
  let contractAddress
  try {
    const ens = getENS()
    //contractAddress = await ens.getAddress('eth-usd.data.eth')
    contractAddress = '0x6CE58Ded5485F5B1d7d8F4B9d78D54f5DD20e412'  //  arb goerli
  } catch {
    //return mainnet if it does not exist
    contractAddress = '0x6CE58Ded5485F5B1d7d8F4B9d78D54f5DD20e412' // dummyoracole= 0x5EB638285E74361aB7F4D9e950c7b4dbc4A3f6EC, stableprice=0x6CE58Ded5485F5B1d7d8F4B9d78D54f5DD20e412
  }
  return contractAddress
}

export default async function getEtherPrice() {
  try {
    const network = await getNetworkId()
    const networkProvider = getNetworkProviderUrl(`${network}`)
    const provider = new ethers.providers.JsonRpcProvider(networkProvider)

    const ethUsdContract = new ethers.Contract(
      await getContract(),
      ChainLinkABI,
      provider
    )
    //const price = (await ethUsdContract.latestAnswer()).toNumber() / 100000000
    const price =
      (await ethUsdContract.price('dummy', 10, 10)).toNumber() / 100000000
    return price
  } catch (e) {
    console.log(e, 'error getting usd price oracle')
  }
}
