// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "../proxy/Initializable.sol";

import "./interfaces/IPriceFeed.sol";

interface ISupraSValueFeed {
    function getSvalue(uint64 _pairIndex) external view returns (bytes32, bool);

    function getSvalues(
        uint64[] memory _pairIndexes
    ) external view returns (bytes32[] memory, bool[] memory);
}

contract WrappedSupraOracleV2 is Initializable, IPriceFeed {
    string public override description = "WrappedSupraOracleV2";
    uint256 constant PRICE_DECIMAL = 100_000_000;
    address public override aggregator;
    address public gov;
    mapping(address => bool) public isAdmin;
    ISupraSValueFeed public supraOracle;
    uint64 public index;

    modifier isSetOracle() {
        require(
            address(supraOracle) != address(0),
            "PriceFeed: must be set WrappedSupraOracle"
        );
        _;
    }

    function initialize(
        ISupraSValueFeed _address,
        uint64 _index
    ) public initializer {
        gov = msg.sender;
        isAdmin[msg.sender] = true;
        supraOracle = _address;
        index = _index;
    }

    function setAdmin(address _account, bool _isAdmin) public {
        require(msg.sender == gov, "PriceFeed: forbidden");
        isAdmin[_account] = _isAdmin;
    }

    function setOracle(ISupraSValueFeed _address, uint64 _index) public {
        require(isAdmin[msg.sender], "PriceFeed: forbidden");
        supraOracle = _address;
        index = _index;
    }

    function latestAnswer() public view override isSetOracle returns (int256) {
        (bytes32 val, ) = supraOracle.getSvalue(index);

        uint256[4] memory decoded = unpack(val);
        uint256 price = (decoded[3] * PRICE_DECIMAL) / (10 ** decoded[1]);
        return int256(price);
    }

    function latestRound() public view override isSetOracle returns (uint80) {
        (bytes32 val, ) = supraOracle.getSvalue(index);

        uint256[4] memory decoded = unpack(val);
        return uint80(decoded[0]);
    }

    function rawData() public view  returns (uint256[4] memory) {
        (bytes32 val, ) = supraOracle.getSvalue(index);

        uint256[4] memory decoded = unpack(val);
        return decoded;
    }
 
    // returns roundId, answer, startedAt, updatedAt, answeredInRound
    function getRoundData(
        uint80 _roundId
    ) public view override returns (uint80, int256, uint256, uint256, uint80) {
        return (0, 0, 0, 0, 0);
    }

    function unpack(bytes32 data) internal pure returns (uint256[4] memory) {
        uint256[4] memory info;

        info[0] = bytesToUint256(abi.encodePacked(data >> 192)); // round
        info[1] = bytesToUint256(abi.encodePacked((data << 64) >> 248)); // decimal
        info[2] = bytesToUint256(abi.encodePacked((data << 72) >> 192)); // timestamp
        info[3] = bytesToUint256(abi.encodePacked((data << 136) >> 160)); // price

        return info;
    }

    function bytesToUint256(
        bytes memory _bs
    ) internal pure returns (uint256 value) {
        require(_bs.length == 32, "bytes length is not 32.");
        assembly {
            value := mload(add(_bs, 0x20))
        }
    }
}
