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
  const BTC = await get('BTC');
  const BTCB = await get('BTC.b');
  const USDC = await get('USDC');
  const USDCE = await get('USDC.E');
  const ETH_WRAPPED = await get('ETH_WRAPPED');
  const AVAX = await get('WAVAX');
  const router = await get('Router');
  const vaultPriceFeed = await get('VaultPriceFeed');
  const vault = await get('Vault');
  const vaultErrorController = await get('VaultErrorController');
  const vaultUtils = await get('VaultUtils');
  const bnBGTX = await get('bnBGTX');
  const sbBGTX = await get('sbBGTX');
  const sBGTX = await get('sBGTX');
  const sbfBGTX = await get('sbfBGTX');
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
  const feeGlpDistributor = await get('FeeGlpDistributor');
  const stakedGlpDistributor = await get('StakedGlpDistributor');
  const stakedGlpTracker = await get('StakedGlpTracker');
  const orderBook = await get('OrderBook');
  const sBGTXRewardDistributor = await get('sBGTXRewardDistributor');
  const sbfBGTXStakedGlpDistributor = await get('sbfBGTXStakedGlpDistributor');

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
    console.log('----------------------------')
    avax.address = AVAX.address;
    eth.address = WETH.address;
  }


  // Chain Fuse Testnet
  if (chainId == '123') {
    console.log('assign PriceFeed');
    const supraPriceFeedFuse = await get('Supra_PriceFeed_fuse');
    const supraPriceFeedAvax = await get('Supra_PriceFeed_avax');
    const supraPriceFeedBtc = await get('Supra_PriceFeed_btc');
    const supraPriceFeedEth = await get('Supra_PriceFeed_eth');
    const supraPriceFeedUSDC = await get('Supra_PriceFeed_usdc');

    native.name = 'fuse';
    avax.name = 'Wrap Fuse';

    native.priceFeed = supraPriceFeedFuse.address;
    avax.priceFeed = supraPriceFeedFuse.address;
    btc.priceFeed = supraPriceFeedBtc.address;
    btcb.priceFeed = supraPriceFeedBtc.address;
    eth.priceFeed = supraPriceFeedEth.address;
    usdce.priceFeed = supraPriceFeedUSDC.address;
    usdc.priceFeed = supraPriceFeedUSDC.address;
  }

  await execute("Vault", { from: deployer, log: true }, "initialize", router.address, USDM.address, vaultPriceFeed.address, toUsd(2), "100", "100");
  await execute("Vault", { from: deployer, log: true }, "setFundingRate", 60 * 60, 100, 100);
  await execute("Vault", { from: deployer, log: true }, "setInManagerMode", true);
  await execute("Vault", { from: deployer, log: true }, "setManager", glpManager.address, true);
  await execute("Vault", { from: deployer, log: true }, "setFees", 10, 5, 20, 20, 1, 10, toUsd(2), 24 * 60 * 60, true);
  await execute("Vault", { from: deployer, log: true }, "setErrorController", vaultErrorController.address);
  await execute("Vault", { from: deployer, log: true }, "setVaultUtils", vaultUtils.address);
  await execute("VaultErrorController", { from: deployer, log: true }, "setErrors", vault.address, errors);

  await execute("BLP", { from: deployer, log: true }, "setInPrivateTransferMode", true);
  await execute("BLP", { from: deployer, log: true }, "setMinter", glpManager.address, true);
  await execute("BLP", { from: deployer, log: true }, "setHandler", fBLP.address, true);
  await execute("FeeGlpTracker", { from: deployer, log: true }, "setHandler", stakedGlpTracker.address, true);
  await execute("USDM", { from: deployer, log: true }, "addVault", glpManager.address);


  await execute("OrderBook", { from: deployer, log: true }, "initialize", router.address, vault.address, WETH.address, USDM.address, "10000000000000000", expandDecimals(10, 30));

  await execute("PositionManager", { from: deployer, log: true }, "setReferralStorage", referralStorage.address);
  await execute("PositionManager", { from: deployer, log: true }, "setShouldValidateIncreaseOrder", false);
  for (let keeper of orderKeepers) {
    await execute("PositionManager", { from: deployer, log: true }, "setOrderKeeper", keeper.address, true);
  }
  for (let liquidator of liquidators) {
    await execute("PositionManager", { from: deployer, log: true }, "setLiquidator", liquidator.address, true);
  }

  await execute("PositionRouter", { from: deployer, log: true }, "setReferralStorage", referralStorage.address);
  await execute("PositionRouter", { from: deployer, log: true }, "setDelayValues", 1, 180, 30 * 60);
  await execute("PositionRouter", { from: deployer, log: true }, "setPositionKeeper", fastPriceFeed.address, true);

  await execute("ShortsTracker", { from: deployer, log: true }, "setHandler", positionManager.address, true);
  await execute("Router", { from: deployer, log: true }, "addPlugin", positionManager.address);
  await execute("Router", { from: deployer, log: true }, "addPlugin", positionRouter.address);
  await execute("Router", { from: deployer, log: true }, "addPlugin", orderBook.address);
  await execute("ShortsTracker", { from: deployer, log: true }, "setHandler", positionRouter.address, true);
  await execute("ReferralStorage", { from: deployer, log: true }, "setHandler", positionRouter.address, true);


  await execute("VaultPriceFeed", { from: deployer, log: true }, "setMaxStrictPriceDeviation", expandDecimals(1, 28));
  await execute("VaultPriceFeed", { from: deployer, log: true }, "setPriceSampleSpace", 1);
  await execute("VaultPriceFeed", { from: deployer, log: true }, "setSecondaryPriceFeed", fastPriceFeed.address);
  await execute("VaultPriceFeed", { from: deployer, log: true }, "setIsAmmEnabled", false);

  const tokenArr = [avax, btc, btcb, eth, usdce, usdc];

  //const vaultTokenInfo =  await read("VaultReader",{ from: deployer },"getVaultTokenInfoV4",vault.address, positionManager.address,WETH.address,1, tokenArr.map(t => t.address));
  const vaultPropsLength = 15;
  for (const [i, tokenItem] of tokenArr.entries()) {
    const token: any = {};
    // token.poolAmount = vaultTokenInfo[i * vaultPropsLength];
    // token.reservedAmount = vaultTokenInfo[i * vaultPropsLength + 1];
    // token.availableAmount = token.poolAmount.sub(token.reservedAmount);
    // token.usdgAmount = vaultTokenInfo[i * vaultPropsLength + 2];
    // token.redemptionAmount = vaultTokenInfo[i * vaultPropsLength + 3];
    // token.weight = vaultTokenInfo[i * vaultPropsLength + 4];
    // token.bufferAmount = vaultTokenInfo[i * vaultPropsLength + 5];
    // token.maxUsdgAmount = vaultTokenInfo[i * vaultPropsLength + 6];
    // token.globalShortSize = vaultTokenInfo[i * vaultPropsLength + 7];
    // token.maxGlobalShortSize = vaultTokenInfo[i * vaultPropsLength + 8];
    // token.maxGlobalLongSize = vaultTokenInfo[i * vaultPropsLength + 9];
    // token.minPrice = vaultTokenInfo[i * vaultPropsLength + 10];
    // token.maxPrice = vaultTokenInfo[i * vaultPropsLength + 11];
    // token.guaranteedUsd = vaultTokenInfo[i * vaultPropsLength + 12];
    // token.maxPrimaryPrice = vaultTokenInfo[i * vaultPropsLength + 13];
    // token.minPrimaryPrice = vaultTokenInfo[i * vaultPropsLength + 14];


    // token.availableUsd = tokenItem.isStable
    //   ? token.poolAmount
    //       .mul(token.minPrice)
    //       .div(expandDecimals(1, tokenItem.decimals))
    //   : token.availableAmount
    //       .mul(token.minPrice)
    //       .div(expandDecimals(1, tokenItem.decimals));

    // token.managedUsd = token.availableUsd.add(token.guaranteedUsd);
    // token.managedAmount = token.managedUsd
    //   .mul(expandDecimals(1, tokenItem.decimals))
    //   .div(token.minPrice);

    // let usdgAmount = token.managedUsd.div(expandDecimals(1, 30 - 18));

    // console.log('usdgAmount',usdgAmount);

    //::TODO await execute("Vault", { from: deployer, log: true }, "clearTokenConfig",tokenItem.address);


    await execute("VaultPriceFeed", { from: deployer, log: true }, "setTokenConfig", tokenItem.address, tokenItem.priceFeed, tokenItem.priceDecimals, tokenItem.isStrictStable);
    await execute("Vault", { from: deployer, log: true }, "setTokenConfig", tokenItem.address, tokenItem.decimals, tokenItem.tokenWeight, tokenItem.minProfitBps, tokenItem.maxUsdgAmount, tokenItem.isStable, tokenItem.isShortable);

    await execute("Vault", { from: deployer, log: true }, "setBufferAmount", tokenItem.address, tokenItem.bufferAmount);

    //  if(tokenItem.usdgAmount){
    //  //  await execute("Vault", { from: deployer, log: true }, "setUsdgAmount",tokenItem.address, tokenItem.usdgAmount);  //tokenItem.usdgAmount
    //  }


    if (tokenItem.spreadBasisPoints === undefined) {
      continue;
    }
    await execute("VaultPriceFeed", { from: deployer, log: true }, "setSpreadBasisPoints", tokenItem.address, tokenItem.spreadBasisPoints);
  }

  const fastPriceTokens = [avax, eth, btcb, btc];

  await execute("FastPriceEvents", { from: deployer, log: true }, "setIsPriceFeed", fastPriceFeed.address, true);
  await execute("FastPriceFeed", { from: deployer, log: true }, "initialize", 1, [deployer], [deployer]);
  await execute("FastPriceFeed", { from: deployer, log: true }, "setTokens", fastPriceTokens.map(t => t.address), fastPriceTokens.map(t => t.fastPricePrecision));
  await execute("FastPriceFeed", { from: deployer, log: true }, "setVaultPriceFeed", vaultPriceFeed.address);
  await execute("FastPriceFeed", { from: deployer, log: true }, "setMaxTimeDeviation", 60 * 60);
  await execute("FastPriceFeed", { from: deployer, log: true }, "setSpreadBasisPointsIfInactive", 50);
  await execute("FastPriceFeed", { from: deployer, log: true }, "setSpreadBasisPointsIfChainError", 500);
  await execute("FastPriceFeed", { from: deployer, log: true }, "setMaxCumulativeDeltaDiffs", fastPriceTokens.map(t => t.address), fastPriceTokens.map(t => t.maxCumulativeDeltaDiff));
  await execute("FastPriceFeed", { from: deployer, log: true }, "setPriceDataInterval", 60);
  await execute("FastPriceFeed", { from: deployer, log: true }, "setTokenManager", tokenManager.address);

  for (let keeper of orderKeepers) {
    await execute("FastPriceFeed", { from: deployer, log: true }, "setUpdater", keeper.address, true);
  }


  await execute("Reader", { from: deployer, log: true }, "setConfig", true); // AVAX

  await execute("EsBGTX", { from: deployer, log: true }, "setInPrivateTransferMode", true);
  await execute("EsBGTX", { from: deployer, log: true }, "setHandler", rewardRouterV2.address, true);
  await execute("EsBGTX", { from: deployer, log: true }, "setHandler", sBGTXRewardDistributor.address, true);
  await execute("EsBGTX", { from: deployer, log: true }, "setHandler", stakedGlpDistributor.address, true);
  await execute("EsBGTX", { from: deployer, log: true }, "setHandler", sBGTX.address, true);
  await execute("EsBGTX", { from: deployer, log: true }, "setHandler", fsBLP.address, true);
  await execute("EsBGTX", { from: deployer, log: true }, "setHandler", vBLP.address, true);
  await execute("EsBGTX", { from: deployer, log: true }, "setHandler", vBGTX.address, true);
  await execute("EsBGTX", { from: deployer, log: true }, "setMinter", deployer, true);
  await execute("EsBGTX", { from: deployer, log: true }, "setMinter", vBGTX.address, true);
  await execute("EsBGTX", { from: deployer, log: true }, "setMinter", vBLP.address, true);
  await execute("EsBGTX", { from: deployer, log: true }, "setMinter", vBLP.address, true);
  await execute("EsBGTX", { from: deployer, log: true }, "mint", sBGTXRewardDistributor.address, '5000000000000000000');
  await execute("EsBGTX", { from: deployer, log: true }, "mint", stakedGlpDistributor.address, '5000000000000000000');
  await execute("EsBGTX", { from: deployer, log: true }, "mint", sBGTXRewardDistributor.address, '200000000000000000000000');
  await execute("EsBGTX", { from: deployer, log: true }, "mint", stakedGlpDistributor.address, '200000000000000000000000');

  await execute("sbBGTX", { from: deployer, log: true }, "initialize", [sBGTX.address], bonusDistributor.address);
  await execute("sbBGTX", { from: deployer, log: true }, "setInPrivateTransferMode", true);
  await execute("sbBGTX", { from: deployer, log: true }, "setInPrivateStakingMode", true);
  await execute("sbBGTX", { from: deployer, log: true }, "setInPrivateClaimingMode", true);
  await execute("sbBGTX", { from: deployer, log: true }, "setHandler", rewardRouterV2.address, true);
  await execute("sbBGTX", { from: deployer, log: true }, "setHandler", sbfBGTX.address, true);
  await execute("sbBGTX", { from: deployer, log: true }, "setHandler", deployer, true);

  await execute("bnBGTX", { from: deployer, log: true }, "setHandler", sbfBGTX.address, true);
  await execute("bnBGTX", { from: deployer, log: true }, "setMinter", rewardRouterV2.address, true);
  await execute("bnBGTX", { from: deployer, log: true }, "setMinter", deployer, true);
  await execute("bnBGTX", { from: deployer, log: true }, "mint", bonusDistributor.address, '10000000000000000000000000');

  await execute("sBGTX", { from: deployer, log: true }, "initialize", [BGTX.address, esBGTX.address], sBGTXRewardDistributor.address);

  await execute("sBGTX", { from: deployer, log: true }, "setDepositToken", BGTX.address, true);
  await execute("sBGTX", { from: deployer, log: true }, "setHandler", sbBGTX.address, true);

  await execute("sbfBGTX", { from: deployer, log: true }, "initialize", [sbBGTX.address, bnBGTX.address], sbfBGTXStakedGlpDistributor.address);
  await execute("sbfBGTX", { from: deployer, log: true }, "setInPrivateTransferMode", true);
  await execute("sbfBGTX", { from: deployer, log: true }, "setInPrivateStakingMode", true);
  await execute("sbfBGTX", { from: deployer, log: true }, "setHandler", rewardRouterV2.address, true);
  await execute("sbfBGTX", { from: deployer, log: true }, "setHandler", vBGTX.address, true);
  await execute("sbfBGTX", { from: deployer, log: true }, "setHandler", deployer, true);



  await execute("StakedGlpTracker", { from: deployer, log: true }, "initialize", [fBLP.address], stakedGlpDistributor.address);
  await execute("StakedGlpTracker", { from: deployer, log: true }, "setInPrivateTransferMode", true);
  await execute("StakedGlpTracker", { from: deployer, log: true }, "setInPrivateStakingMode", true);
  await execute("StakedGlpTracker", { from: deployer, log: true }, "setHandler", vBLP.address, true);
  await execute("StakedGlpTracker", { from: deployer, log: true }, "setHandler", rewardRouterV2.address, true);
  await execute("StakedGlpTracker", { from: deployer, log: true }, "setHandler", glpRewardRouter.address, true);
  await execute("StakedGlpTracker", { from: deployer, log: true }, "setHandler", deployer, true);

  await execute("FeeGlpTracker", { from: deployer, log: true }, "initialize", [BLP.address], feeGlpDistributor.address);
  await execute("FeeGlpTracker", { from: deployer, log: true }, "setInPrivateTransferMode", true);
  await execute("FeeGlpTracker", { from: deployer, log: true }, "setInPrivateStakingMode", true);
  await execute("FeeGlpTracker", { from: deployer, log: true }, "setHandler", stakedGlpTracker.address, true);
  await execute("FeeGlpTracker", { from: deployer, log: true }, "setHandler", rewardRouterV2.address, true);
  await execute("FeeGlpTracker", { from: deployer, log: true }, "setHandler", glpRewardRouter.address, true);

  await execute("sBGTX", { from: deployer, log: true }, "setHandler", rewardRouterV2.address, true);

  await execute("GlpManager", { from: deployer, log: true }, "setInPrivateMode", true);
  await execute("GlpManager", { from: deployer, log: true }, "setHandler", rewardRouterV2.address, true);


  await execute("GlpManagerRewardRouter", { from: deployer, log: true }, "setInPrivateMode", true);


  await execute("RewardRouterV2", { from: deployer, log: true }, "initialize", WETH.address, BGTX.address, esBGTX.address, bnBGTX.address, BLP.address, sBGTX.address, sbBGTX.address, sbfBGTX.address, fBLP.address, fsBLP.address, glpManager.address, vBGTX.address, vBLP.address);

  glpManager.address,
    await execute("GlpRewardRouter", { from: deployer, log: true }, "initialize", WETH.address, "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000", BLP.address, "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000", fBLP.address, fsBLP.address, glpManager.address, "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000");

  await execute("GlpManager", { from: deployer, log: true }, "setHandler", glpRewardRouter.address, true);



  await execute("FeeGlpDistributor", { from: deployer, log: true }, "updateLastDistributionTime");
  await execute("StakedGlpDistributor", { from: deployer, log: true }, "updateLastDistributionTime");



  await execute("vBLP", { from: deployer, log: true }, "setHandler", rewardRouterV2.address, true);
  await execute("vBGTX", { from: deployer, log: true }, "setHandler", rewardRouterV2.address, true);


};

func.tags = ['configuration'];



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


const errors = [
  "Vault: zero error",
  "Vault: already initialized",
  "Vault: invalid _maxLeverage",
  "Vault: invalid _taxBasisPoints",
  "Vault: invalid _stableTaxBasisPoints",
  "Vault: invalid _mintBurnFeeBasisPoints",
  "Vault: invalid _swapFeeBasisPoints",
  "Vault: invalid _stableSwapFeeBasisPoints",
  "Vault: invalid _marginFeeBasisPoints",
  "Vault: invalid _liquidationFeeUsd",
  "Vault: invalid _fundingInterval",
  "Vault: invalid _fundingRateFactor",
  "Vault: invalid _stableFundingRateFactor",
  "Vault: token not whitelisted",
  "Vault: _token not whitelisted",
  "Vault: invalid tokenAmount",
  "Vault: _token not whitelisted",
  "Vault: invalid tokenAmount",
  "Vault: invalid usdgAmount",
  "Vault: _token not whitelisted",
  "Vault: invalid usdgAmount",
  "Vault: invalid redemptionAmount",
  "Vault: invalid amountOut",
  "Vault: swaps not enabled",
  "Vault: _tokenIn not whitelisted",
  "Vault: _tokenOut not whitelisted",
  "Vault: invalid tokens",
  "Vault: invalid amountIn",
  "Vault: leverage not enabled",
  "Vault: insufficient collateral for fees",
  "Vault: invalid position.size",
  "Vault: empty position",
  "Vault: position size exceeded",
  "Vault: position collateral exceeded",
  "Vault: invalid liquidator",
  "Vault: empty position",
  "Vault: position cannot be liquidated",
  "Vault: invalid position",
  "Vault: invalid _averagePrice",
  "Vault: collateral should be withdrawn",
  "Vault: _size must be more than _collateral",
  "Vault: invalid msg.sender",
  "Vault: mismatched tokens",
  "Vault: _collateralToken not whitelisted",
  "Vault: _collateralToken must not be a stableToken",
  "Vault: _collateralToken not whitelisted",
  "Vault: _collateralToken must be a stableToken",
  "Vault: _indexToken must not be a stableToken",
  "Vault: _indexToken not shortable",
  "Vault: invalid increase",
  "Vault: reserve exceeds pool",
  "Vault: max USDM exceeded",
  "Vault: reserve exceeds pool",
  "Vault: forbidden",
  "Vault: forbidden",
  "Vault: maxGasPrice exceeded"
]

const orderKeepers = [
  { address: "0x14CbF9E43Fa18C659E82b3a3660943C86392f618" }
]
const liquidators = [
  { address: "0x32BAb062F39b2065EC9c43F9828b72fb1499dEd5" }
]
