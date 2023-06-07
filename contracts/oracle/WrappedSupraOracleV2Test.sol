// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "./interfaces/IPriceFeed.sol";

interface ISupraSValueFeedV2 {
    function getSvalue(uint64 _pairIndex) external view returns (bytes32, bool);

    function getSvalues(
        uint64[] memory _pairIndexes
    ) external view returns (bytes32[] memory, bool[] memory);
}

contract WrappedSupraOracleV2Test  {
    int256 public answer;
    uint80 public roundId;
 
    address public gov;

    mapping(address => bool) public isAdmin;
    ISupraSValueFeedV2 public supraOracle;

    modifier isSetOracle() {
        require(
            address(supraOracle) != address(0),
            "PriceFeed: must be set WrappedSupraOracle"
        );
        _;
    }

    constructor(ISupraSValueFeedV2 _address) public {
        gov = msg.sender;
        isAdmin[msg.sender] = true;
        supraOracle = _address;
    }

    function setAdmin(address _account, bool _isAdmin) public {
        require(msg.sender == gov, "PriceFeed: forbidden");
        isAdmin[_account] = _isAdmin;
    }

    function setOracle(ISupraSValueFeedV2 _address) public {
        require(isAdmin[msg.sender], "PriceFeed: forbidden");
        supraOracle = _address;
    }

    function latestAnswer(uint64 _index) external view  returns (uint256[4] memory) {
        (bytes32 val,) = supraOracle.getSvalue(_index);

        uint256[4] memory decoded = unpack(val);
        return decoded;
    }
 

    function unpack(bytes32 data) internal pure returns(uint256[4] memory) {
        uint256[4] memory info;

        info[0] = bytesToUint256(abi.encodePacked(data >> 192));       // round
        info[1] = bytesToUint256(abi.encodePacked(data << 64 >> 248)); // decimal
        info[2] = bytesToUint256(abi.encodePacked(data << 72 >> 192)); // timestamp
        info[3] = bytesToUint256(abi.encodePacked(data << 136 >> 160)); // price

        return info;
    }

    function bytesToUint256(bytes memory _bs) internal pure returns (uint256 value) {
        require(_bs.length == 32, "bytes length is not 32.");
        assembly {
            value := mload(add(_bs, 0x20))
        }
    }

}
