import hardhat from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const { getChainId, ethers } = hardhat

const func: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
   
   await deploy('WETH', {
    contract: 'WETH',
    from: deployer,
    log: true,
    args: ["Wrapped Ether","WETH",18],
  });

   await deploy('QLP', {
    contract: 'QLP',
    from: deployer,
    log: true,
    args: [],
  });

   await deploy('Qiji', {
    contract: 'Qiji',
    from: deployer,
    log: true,
    args: [],
  });

  await deploy('Multicall3', {
    contract: 'Multicall3',
    from: deployer,
    log: true,
    args: [],
  });


};

func.tags = ['prepare'];


export default func;