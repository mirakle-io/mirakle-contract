import hardhat from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const { getChainId, ethers } = hardhat

const func: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deploy,get,execute,read } = deployments;
  const { deployer } = await getNamedAccounts();
 
  const USDM = await get('USDM');
  const USDC = await get('USDC');

  const WETH = await get('WETH');
  const QLP = await get('QLP');
  const router = await get('Router');
  const vaultPriceFeed = await get('VaultPriceFeed');
  const vault = await get('Vault');
  const bnQiji = await get('bnQiji');
  const sbQiji = await get('sbQiji');
  const sQiji = await get('sQiji');
  const bonusDistributor = await get('BonusDistributor'); 
  const esQiji = await get('EsQiji');
  const fQiji = await get('fQiji');
  const fsQLP = await get('StakedGlpTracker');
  const glpManager = await get('GlpManager');
  const vQiji = await get('vQiji');
  const vQLP = await get('vQLP');
  const fQLP = await get('FeeGlpTracker');
  const glpManagerRewardRouter = await get('GlpManagerRewardRouter');
  const fastPriceEvents = await get('FastPriceEvents');
  const fastPriceFeed = await get('FastPriceFeed');
  const rewardReader = await get('RewardReader');


  await execute("WAVAX", { from: deployer, log: true }, "Swapin","0x0000000000000000000000000000000000000000000000000000000000000000",deployer,"100000000000000000000000000");

    await execute("USDC", { from: deployer, log: true }, "Swapin","0x0000000000000000000000000000000000000000000000000000000000000000",deployer,"1000000000000000");


   await execute("BTC", { from: deployer, log: true }, "Swapin","0x0000000000000000000000000000000000000000000000000000000000000000",deployer,"100000000000000");

   await execute("USDC.E", { from: deployer , log: true }, "Swapin","0x0000000000000000000000000000000000000000000000000000000000000000",deployer,"1000000000000000");

    await execute("BTC.b", { from: deployer, log: true }, "Swapin","0x0000000000000000000000000000000000000000000000000000000000000000",deployer,"10000000000000");

     await execute("ETH_WRAPPED", { from: deployer, log: true }, "Swapin","0x0000000000000000000000000000000000000000000000000000000000000000",deployer,"1000000000000000000000");

   await execute("WETH", { from: deployer, log: true, value: ethers.utils.parseEther("100") }, "deposit");
   await execute("Qiji", { from: deployer, log: true }, "setMinter",deployer,true);
   await execute("Qiji", { from: deployer, log: true }, "mint",deployer,"100000000000000000000000");

   await execute("Qiji", { from: deployer, log: true }, "mint",deployer,"100000000000000000000000");


   await execute("Qiji", { from: deployer, log: true }, "approve","0xd7f655e3376ce2d7a2b08ff01eb3b1023191a901","1000000000000000000000000000");
  await execute("WETH", { from: deployer, log: true }, "approve","0xd7f655e3376ce2d7a2b08ff01eb3b1023191a901","1000000000000000000000000000");
    await execute("WETH", { from: deployer, log: true }, "approve","0xd7f655e3376ce2d7a2b08ff01eb3b1023191a901","1000000000000000000000000000");

//   const getDepositBalances =  await read("RewardReader", { from: deployer }, "getDepositBalances","0x2CE70FAD8946C90F051a6e45D2a593fD7b740C4a",[
//     "0xb9f1a8Cb43dec955e66d99420a83A3c27F6E6052",
//     "0x6Dd30956EEE9c47bE0195E847cE3cDe0B578ba34",
//     "0x19ffeF225B02cb635AeB3Ea67561De0ad8989d18",
//     "0x3d1aA4D92E50eA33b3831c2db1fF9aE9F997Adff",
//     "0xc8Ac05A88FAf1763F8cAbe69a0Da970463890C87",
//     "0x2241e5de846755F44634603159738d0ACB9596A7"
// ],[
//     "0x19ffeF225B02cb635AeB3Ea67561De0ad8989d18",
//     "0x19ffeF225B02cb635AeB3Ea67561De0ad8989d18",
//     "0x3d1aA4D92E50eA33b3831c2db1fF9aE9F997Adff",
//     "0x7C98f98B2531f7Ad7D6781e8844121DCfEfb88E5",
//     "0x7C98f98B2531f7Ad7D6781e8844121DCfEfb88E5",
//     "0xcCE0d0f35f84d33b7D664ec92C8619e7C73B4dB1"
// ]);

// console.log(getDepositBalances);


  //pair: 0xaad35d4b7fab96d84ef09dbcee467b98e1a900e3

};

func.tags = ['config_testing'];


export default func;