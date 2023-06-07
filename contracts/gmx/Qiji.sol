// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "../tokens/MintableBaseToken.sol";

contract Qiji is MintableBaseToken {
    constructor() public MintableBaseToken("Qiji", "Qiji", 0) {}

    function id() external pure returns (string memory _name) {
        return "Qiji";
    }
}
