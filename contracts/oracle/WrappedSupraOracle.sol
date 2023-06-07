// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "./interfaces/IPriceFeed.sol";

interface ISupraSValueFeed {
    function checkPrice(string memory marketPair)
        external
        view
        returns (int256 price, uint256 timestamp);
}

contract WrappedSupraOracle is IPriceFeed {
    int256 public answer;
    uint80 public roundId;
    string public override description = "WrappedSupraOracle";
    address public override aggregator;

    address public gov;

    mapping(address => bool) public isAdmin;
    ISupraSValueFeed public supraOracle;
    string public supraOracleKey;

    modifier isSetOracle() {
        require(
            address(supraOracle) != address(0),
            "PriceFeed: must be set WrappedSupraOracle"
        );
        _;
    }

    constructor(ISupraSValueFeed _address, string memory _key) public {
        gov = msg.sender;
        isAdmin[msg.sender] = true;
        supraOracle = _address;
        supraOracleKey = _key;
    }

    function setAdmin(address _account, bool _isAdmin) public {
        require(msg.sender == gov, "PriceFeed: forbidden");
        isAdmin[_account] = _isAdmin;
    }

    function setDIAOracle(ISupraSValueFeed _address, string memory _key)
        public
    {
        require(isAdmin[msg.sender], "PriceFeed: forbidden");
        supraOracle = _address;
        supraOracleKey = _key;
    }

    function latestAnswer() public view override isSetOracle returns (int256) {
        (int256 price, uint256 timestamp) = supraOracle.checkPrice(
            supraOracleKey
        );

        return price;
    }

    function latestAnswer2()
        public
        view
        isSetOracle
        returns (int256 price, uint256 timestamp)
    {
        (price, timestamp) = supraOracle.checkPrice(supraOracleKey);
    }

    function latestRound() public view override isSetOracle returns (uint80) {
        (int256 price, uint256 timestamp) = supraOracle.checkPrice(
            supraOracleKey
        );

        return uint80(timestamp);
    }

    // returns roundId, answer, startedAt, updatedAt, answeredInRound
    function getRoundData(uint80 _roundId)
        public
        view
        override
        returns (
            uint80,
            int256,
            uint256,
            uint256,
            uint80
        )
    {
        return (0, 0, 0, 0, 0);
    }
}
