// compiled using solidity 0.6.12

pragma solidity 0.6.12;

contract SupraSValueFeed {
    mapping(string => int256) public prices;
    mapping(string => uint256) public timestamps;
    address oracleUpdater;

    event OracleUpdate(string key, int256 value, uint256 timestamp);
    event UpdaterAddressChange(address newUpdater);

    constructor() public {
        oracleUpdater = msg.sender;
    }

    function setValue(
        string memory key,
        int256 value,
        uint256 timestamp
    ) public {
        require(msg.sender == oracleUpdater);
        prices[key] = value;
        timestamps[key] = timestamp;
        emit OracleUpdate(key, value, timestamp);
    }

    function checkPrice(string memory marketPair)
        external
        view
        returns (int256 price, uint256 timestamp)
    {
        price = prices[marketPair];
        timestamp = timestamps[marketPair];
    }

    function updateOracleUpdaterAddress(address newOracleUpdaterAddress)
        public
    {
        require(msg.sender == oracleUpdater);
        oracleUpdater = newOracleUpdaterAddress;
        emit UpdaterAddressChange(newOracleUpdaterAddress);
    }
}
