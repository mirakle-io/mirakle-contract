// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "./interfaces/IPriceFeed.sol";

interface IDIAOracle {
    function getValue(string memory key)
        external
        view
        returns (uint128, uint128);
}

contract WrappedDIAOracle is IPriceFeed {
    int256 public answer;
    uint80 public roundId;
    string public override description = "WrappedDIAOracle";
    address public override aggregator;

    address public gov;

    mapping(address => bool) public isAdmin;
    address public diaOracle;
    string public diaOracleKey;

    modifier isSetOracle() {
        require(diaOracle != address(0), "PriceFeed: must be set DIAOracle");
        _;
    }

    constructor(address _address, string memory _key) public {
        gov = msg.sender;
        isAdmin[msg.sender] = true;
        diaOracle = _address;
        diaOracleKey = _key;
    }

    function setAdmin(address _account, bool _isAdmin) public {
        require(msg.sender == gov, "PriceFeed: forbidden");
        isAdmin[_account] = _isAdmin;
    }

    function setDIAOracle(address _address, string memory _key) public {
        require(isAdmin[msg.sender], "PriceFeed: forbidden");
        diaOracle = _address;
        diaOracleKey = _key;
    }

    function latestAnswer() public view override isSetOracle returns (int256) {
        (uint128 latestPrice, uint128 timestampOflatestPrice) = IDIAOracle(
            diaOracle
        ).getValue(diaOracleKey);

        return int256(latestPrice);
    }

    function latestAnswer2()
        public
        view
        isSetOracle
        returns (uint128 latestPrice, uint128 timestampOflatestPrice)
    {
        (latestPrice, timestampOflatestPrice) = IDIAOracle(diaOracle).getValue(
            diaOracleKey
        );
    }

    function latestRound() public view override isSetOracle returns (uint80) {
        (uint128 latestPrice, uint128 timestampOflatestPrice) = IDIAOracle(
            diaOracle
        ).getValue(diaOracleKey);

        return uint80(timestampOflatestPrice);
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
