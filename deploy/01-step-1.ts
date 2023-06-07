import hardhat from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const { getChainId, ethers } = hardhat

const func: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deploy,get,execute } = deployments;
  const { deployer } = await getNamedAccounts();
 
  const vault = await deploy('Vault', {
    contract: 'Vault',
    from: deployer,
    log: true,
    args: [],
  });

  const vaultErrorController = await deploy('VaultErrorController', {
    contract: 'VaultErrorController',
    from: deployer,
    log: true,
    args: [],
  });

   const vaultUtils = await deploy('VaultUtils', {
    contract: 'VaultUtils',
    from: deployer,
    log: true,
    args: [vault.address],
  });

  const USDM =  await deploy('USDM', {
    contract: 'USDM',
    from: deployer,
    log: true,
    args: [vault.address],
  });


  const vaultPriceFeed = await deploy('VaultPriceFeed', {
    contract: 'VaultPriceFeed',
    from: deployer,
    log: true,
    args: [],
  });

  const vaultReader = await deploy('VaultReader', {
    contract: 'VaultReader',
    from: deployer,
    log: true,
    args: [],
  });

  const orderBook =await deploy('OrderBook', {
    contract: 'OrderBook',
    from: deployer,
    log: true,
    args: [],
  });

  const WETH = await get('WETH');
  const QLP = await get('QLP');
  const Qiji = await get('Qiji');

 
  const router =await deploy('Router', {
    contract: 'Router',
    from: deployer,
    log: true,
    args: [vault.address,USDM.address,WETH.address],
  });


  const shortsTracker =await deploy('ShortsTracker', {
    contract: 'ShortsTracker',
    from: deployer,
    log: true,
    args: [vault.address],
  });

  const positionRouter =await deploy('PositionRouter', {
    contract: 'PositionRouter',
    from: deployer,
    log: true,
    args: [vault.address,router.address,WETH.address,shortsTracker.address,30,100000000000000],
  });
  
   const reader =await deploy('Reader', {
    contract: 'Reader',
    from: deployer,
    log: true,
    args: [],
  });

  const rewardReader =await deploy('RewardReader', {
    contract: 'RewardReader',
    from: deployer,
    log: true,
    args: [],
  });

   const orderBookReader =await deploy('OrderBookReader', {
    contract: 'OrderBookReader',
    from: deployer,
    log: true,
    args: [],
  });

  const esQiji =await deploy('EsQiji', {
    contract: 'EsQiji',
    from: deployer,
    log: true,
    args: [],
  }); 


   const glpManager =await deploy('GlpManager', {
    contract: 'GlpManager',
    from: deployer,
    log: true,
    args: [vault.address,USDM.address,QLP.address,shortsTracker.address,0],
  });

   const rewardRouterV2 =await deploy('RewardRouterV2', {
    contract: 'RewardRouterV2',
    from: deployer,
    log: true,
    args: [],
  });
  
   const glpRewardRouter =await deploy('GlpRewardRouter', {
    contract: 'RewardRouterV2',
    from: deployer,
    log: true,
    args: [],
  });

   const feeGlpTracker =await deploy('FeeGlpTracker', {
    contract: 'RewardTracker',
    from: deployer,
    log: true,
    args: ["Fee QLP","fQLP"],
  });

  const feeGlpDistributor =await deploy('FeeGlpDistributor', {
    contract: 'RewardDistributor',
    from: deployer,
    log: true,
    args: [WETH.address, feeGlpTracker.address],
  });


  const stakedGlpTracker =await deploy('StakedGlpTracker', {
    contract: 'RewardTracker',
    from: deployer,
    log: true,
    args: ["Fee + Staked QLP","fsQLP"],
  });

   const stakedGlpDistributor =await deploy('StakedGlpDistributor', {
    contract: 'RewardDistributor',
    from: deployer,
    log: true,
    args: [esQiji.address, stakedGlpTracker.address],
  });

  const stakedGlp =await deploy('StakedGlp', {
    contract: 'StakedGlp',
    from: deployer,
    log: true,
    args: [QLP.address,glpManager.address,stakedGlpTracker.address,feeGlpTracker.address],
  });

  const sbfQiji =await deploy('sbfQiji', {
    contract: 'RewardTracker',
    from: deployer,
    log: true,
    args: ["Staked + Bonus + Fee QLP","sbfQiji"],
  });

 const sbfQijiStakedGlpDistributor =await deploy('sbfQijiStakedGlpDistributor', {
    contract: 'RewardDistributor',
    from: deployer,
    log: true,
    args: [WETH.address, sbfQiji.address],
  });

  const sbQiji =await deploy('sbQiji', {
    contract: 'RewardTracker',
    from: deployer,
    log: true,
    args: ["Staked + Bonus Qiji","sbQiji"],
  });

   const fQiji =await deploy('fQiji', {
    contract: 'RewardTracker',
    from: deployer,
    log: true,
    args: ["Fee QLP","fQiji"],
  });

   const sQiji =await deploy('sQiji', {
    contract: 'RewardTracker',
    from: deployer,
    log: true,
    args: ["Staked Qiji","sQiji"],
  });

    await deploy('sQijiRewardDistributor', {
    contract: 'RewardDistributor',
    from: deployer,
    log: true,
    args: [esQiji.address,sQiji.address],
  });
  
  const bonusQiji =await deploy('bnQiji', {
    contract: 'MintableBaseToken',
    from: deployer,
    log: true,
    args: ["Bonus Qiji","bnQiji",0],
  });

   const bonusDistributor =await deploy('BonusDistributor', {
    contract: 'BonusDistributor',
    from: deployer,
    log: true,
    args: [bonusQiji.address,sbQiji.address],
  });


   const vQiji =await deploy('vQiji', {
    contract: 'Vester',
    from: deployer,
    log: true,
    args: ["Vested Qiji","vQiji",31536000,esQiji.address,sbfQiji.address,Qiji.address,sQiji.address],
  });

  const vQLP =await deploy('vQLP', {
    contract: 'Vester',
    from: deployer,
    log: true,
    args: ["Vested QLP","vQLP",31536000,esQiji.address,stakedGlpTracker.address,Qiji.address,stakedGlpTracker.address],
  });

 const glpManagerRewardRouter =await deploy('GlpManagerRewardRouter', {
    contract: 'GlpManagerRewardRouter',
    from: deployer,
    log: true,
    args: [vault.address,USDM.address,QLP.address,0],
  });

   const fastPriceEvents =await deploy('FastPriceEvents', {
    contract: 'FastPriceEvents',
    from: deployer,
    log: true,
    args: [],
  });

   const tokenManager =await deploy('TokenManager', {
    contract: 'TokenManager',
    from: deployer,
    log: true,
    args: [1],
  });

  const fastPriceFeed =await deploy('FastPriceFeed', {
    contract: 'FastPriceFeed',
    from: deployer,
    log: true,
    args: [300,3600,1,1000,fastPriceEvents.address,deployer,positionRouter.address],
  });
 
  const batchSender =await deploy('BatchSender', {
    contract: 'BatchSender',
    from: deployer,
    log: true,
    args: [],
  });

   const xw =await deploy('PositionManager', {
    contract: 'PositionManager',
    from: deployer,
    log: true,
    args: [vault.address,router.address,shortsTracker.address,WETH.address,30,orderBook.address],
  });

   const referralStorage =await deploy('ReferralStorage', {
    contract: 'ReferralStorage',
    from: deployer,
    log: true,
    args: [],
  });

    const referralReader =await deploy('ReferralReader', {
    contract: 'ReferralReader',
    from: deployer,
    log: true,
    args: [],
  });

  await deploy('BTC', {
    contract: 'BridgeToken',
    from: deployer,
    log: true,
    args: ["BTC","BTC",8,deployer],
  });

   await deploy('BTC.b', {
    contract: 'BridgeToken',
    from: deployer,
    log: true,
    args: ["BTC.b","BTC.b",8,deployer],
  });

   await deploy('USDC', {
    contract: 'BridgeToken',
    from: deployer,
    log: true,
    args: ["USDC","USDC",6,deployer],
  });

   await deploy('USDC.E', {
    contract: 'BridgeToken',
    from: deployer,
    log: true,
    args: ["USDC.E","USDC.E",6,deployer],
  });

  await deploy('ETH_WRAPPED', {
    contract: 'BridgeToken',
    from: deployer,
    log: true,
    args: ["wETH","wETH",18,deployer],
  });

   await deploy('WAVAX', {
    contract: 'BridgeToken',
    from: deployer,
    log: true,
    args: ["WAVAX","WAVAX",18,deployer],
  });

  
};

func.tags = ['step_1'];


export default func;