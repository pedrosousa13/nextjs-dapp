import {useState} from 'react'
import {ethers} from 'ethers'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Greeter from '../artifacts/contracts/Greeter.sol/Greeter.json'
import Token from '../artifacts/contracts/Token.sol/Token.json'

const greeterAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const tokenAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'

export default function Home() {
  const [greeting, setGreetingValue] = useState('')
  const [userAccount, setUserAccount] = useState('')
  const [amount, setAmount] = useState(0)

  const requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  const getBalance = async () => {
    if (typeof window.ethereum === 'undefined') return
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
    const balance = await contract.balanceOf(account)
    console.log('Balance: ', balance.toString())
  }

  const sendCoins = async () => {
    if (typeof window.ethereum === 'undefined') return
    await requestAccount()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(greeterAddress, Token.abi, signer)
    const transaction = await contract.transfer(userAccount, amount)
    await transaction.wait()
    console.log(`${amount} Coins successfully sent to ${userAccount}`)
  }

  const fetchGreeting = async () => {
    if (typeof window.ethereum === 'undefined') return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)

    try {
      const data = await contract.greet()
      console.log({ data })
    } catch (err) {
      console.log({err})
    }

  }

  const setGreeting = async () => {
    if (!greeting || typeof window.ethereum === 'undefined') return
    await requestAccount()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
    const transaction = await contract.setGreeting(greeting)
    setGreetingValue('')
    await transaction.wait()
    await fetchGreeting()
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={() => fetchGreeting()}>Fetch Greeting</button>
        <button onClick={() => setGreeting()}>Set Greeting</button>
        <input
          type="text"
          onChange={e => setGreetingValue(e.target.value)}
          placeholder='Set Greeting'
          value={greeting}
        />
      </main>
    </div>
  )
}
