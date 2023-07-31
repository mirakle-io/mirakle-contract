import hardhat from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import Avaxconfiguration from "./configuration";
import BaseConfiguration from "./configuration.base";

const { getChainId, ethers } = hardhat

const func: DeployFunction = async ({ deployments, getNamedAccounts, getChainId }) => {
  const { deploy, get, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();



  const USDM = await get('USDM');
  const WETH = await get('WETH');
  const BLP = await get('BLP');
  const BGTX = await get('BGTX');
  const router = await get('Router');
  const vaultPriceFeed = await get('VaultPriceFeed');
  const vault = await get('Vault');
  const vaultErrorController = await get('VaultErrorController');
  const vaultUtils = await get('VaultUtils');
  const vaultReader = await get('VaultReader');
  const bnBGTX = await get('bnBGTX');
  const sbBGTX = await get('sbBGTX');
  const sBGTX = await get('sBGTX');
  const bonusDistributor = await get('BonusDistributor');
  const esBGTX = await get('EsBGTX');
  const fBGTX = await get('fBGTX');
  const fsBLP = await get('StakedGlpTracker');
  const glpManager = await get('GlpManager');
  const vBGTX = await get('vBGTX');
  const vBLP = await get('vBLP');
  const fBLP = await get('FeeGlpTracker');
  const glpManagerRewardRouter = await get('GlpManagerRewardRouter');
  const fastPriceEvents = await get('FastPriceEvents');
  const fastPriceFeed = await get('FastPriceFeed');
  const referralStorage = await get('ReferralStorage');
  const positionManager = await get('PositionManager');
  const positionRouter = await get('PositionRouter');
  const rewardRouterV2 = await get('RewardRouterV2');
  const tokenManager = await get('TokenManager');
  const glpRewardRouter = await get('GlpRewardRouter');
  const BTC = await get('BTC');
  const BTCB = await get('BTC.b');
  const USDC = await get('USDC');
  const USDCE = await get('USDC.E');
  const ETH_WRAPPED = await get('ETH_WRAPPED');
  const AVAX = await get('WAVAX');

  let configuration = Avaxconfiguration;
  if (chainId == '84531') {
    configuration = BaseConfiguration;
  }

  let { native, avax, btc, btcb, eth, usdce, usdc } = configuration;

  avax.address = WETH.address;
  btc.address = BTC.address;
  btcb.address = BTCB.address;
  eth.address = ETH_WRAPPED.address;
  usdce.address = USDCE.address;
  usdc.address = USDC.address;

  if (chainId == '84531') {
    avax.address = AVAX.address;
    eth.address = WETH.address;
  }


  const buffer = 24 * 60 * 60;
  const maxTokenSupply = expandDecimals(13250000, 18);
  const mintReceiver = tokenManager.address;

  const timelock = await deploy('Timelock', {
    contract: 'Timelock',
    from: deployer,
    log: true,
    args: [deployer, buffer, tokenManager.address, mintReceiver, glpManager.address, rewardRouterV2.address, maxTokenSupply, 10, 500]
  });

  await execute("BGTX", { from: deployer, log: true }, "approve", timelock.address, "1000000000000");

  await execute("Timelock", { from: deployer, log: true }, "setShouldToggleIsLeverageEnabled", true);
  await execute("Timelock", { from: deployer, log: true }, "setContractHandler", positionRouter.address, true);
  await execute("Timelock", { from: deployer, log: true }, "setContractHandler", positionManager.address, true);
  await execute("Timelock", { from: deployer, log: true }, "setContractHandler", deployer, true);
  await execute("Timelock", { from: deployer, log: true }, "signalApprove", BGTX.address, deployer, "100000000");
  //await execute("Timelock", { from: deployer, log: true },"initGlpManager");
  //await execute("Timelock", { from: deployer, log: true },"initRewardRouter");

  const tokenArr = [avax, eth, btcb, btc, usdc, usdce];
  const vaultTokenInfo = await read("VaultReader", { from: deployer }, "getVaultTokenInfoV4", vault.address, positionManager.address, WETH.address, 1, tokenArr.map(t => t.address));
  console.log(vaultTokenInfo);
  const vaultPropsLength = 15;

  for (const [i, tokenItem] of tokenArr.entries()) {
    const token: any = {};
    token.poolAmount = vaultTokenInfo[i * vaultPropsLength];
    token.reservedAmount = vaultTokenInfo[i * vaultPropsLength + 1];
    token.availableAmount = token.poolAmount.sub(token.reservedAmount);
    token.usdgAmount = vaultTokenInfo[i * vaultPropsLength + 2];
    token.redemptionAmount = vaultTokenInfo[i * vaultPropsLength + 3];
    token.weight = vaultTokenInfo[i * vaultPropsLength + 4];
    token.bufferAmount = vaultTokenInfo[i * vaultPropsLength + 5];
    token.maxUsdgAmount = vaultTokenInfo[i * vaultPropsLength + 6];
    token.globalShortSize = vaultTokenInfo[i * vaultPropsLength + 7];
    token.maxGlobalShortSize = vaultTokenInfo[i * vaultPropsLength + 8];
    token.maxGlobalLongSize = vaultTokenInfo[i * vaultPropsLength + 9];
    token.minPrice = vaultTokenInfo[i * vaultPropsLength + 10];
    token.maxPrice = vaultTokenInfo[i * vaultPropsLength + 11];
    token.guaranteedUsd = vaultTokenInfo[i * vaultPropsLength + 12];
    token.maxPrimaryPrice = vaultTokenInfo[i * vaultPropsLength + 13];
    token.minPrimaryPrice = vaultTokenInfo[i * vaultPropsLength + 14];


    token.availableUsd = tokenItem.isStable
      ? token.poolAmount
        .mul(token.minPrice)
        .div(expandDecimals(1, tokenItem.decimals))
      : token.availableAmount
        .mul(token.minPrice)
        .div(expandDecimals(1, tokenItem.decimals));

    token.managedUsd = token.availableUsd.add(token.guaranteedUsd);
    token.managedAmount = token.managedUsd
      .mul(expandDecimals(1, tokenItem.decimals))
      .div(token.minPrice);

    let usdgAmount = token.managedUsd.div(expandDecimals(1, 30 - 18));

    //  await execute("Timelock", { from: deployer, log: true }, "setTokenConfig", vault.address, tokenItem.address,tokenItem.tokenWeight, tokenItem.minProfitBps, expandDecimals(tokenItem.maxUsdgAmount, 18), expandDecimals(tokenItem.bufferAmount, tokenItem.decimals),usdgAmount);   
  }
  await execute("Vault", { from: deployer, log: true }, "setGov", timelock.address);
};


func.tags = ['timelock'];


export default func;

function toUsd(value: number) {
  const normalizedValue = value * Math.pow(10, 10)
  return ethers.BigNumber.from(normalizedValue).mul(ethers.BigNumber.from(10).pow(20))
}

function bigNumberify(n: number) {
  return ethers.BigNumber.from(n)
}

function expandDecimals(n: number, decimals: number) {
  return bigNumberify(n).mul(bigNumberify(10).pow(decimals))
}