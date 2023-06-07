import hardhat from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"
import SupraConfiguration from "./000-fuse-oracle-supra.config"

const { getChainId, ethers } = hardhat

const func: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deploy,get,execute ,read} = deployments;
 const { deployer } = await getNamedAccounts();
  


  const pairs = Object.keys(SupraConfiguration);
  for(let pair of pairs){
    await deploy(`Supra_PriceFeed_${pair}`, {
    contract: 'WrappedSupraOracle',
    from: deployer,
    log: true,
    args: [SupraConfiguration[pair].address, SupraConfiguration[pair].pair],
  });
  }

   const supraSValueFeed = await deploy(`SupraSValueFeed`, {
    contract: 'SupraSValueFeed',
    from: deployer,
    log: true,
    args: [],
  });

   await deploy(`Supra_PriceFeed_fuse`, {
    contract: 'WrappedSupraOracle',
    from: deployer,
    log: true,
    args: [supraSValueFeed.address, 'fuse_usdt']});

    await execute("SupraSValueFeed", { from: deployer, log: true }, "setValue",'fuse_usdt','7748562', '1677552163');
};

func.tags = ['supra_price_feed'];


export default func;