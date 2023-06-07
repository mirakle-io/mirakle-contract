// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "../tokens/MintableBaseToken.sol";

contract EsQiji is MintableBaseToken {
    constructor() public MintableBaseToken("Escrowed EsQiji", "esQiji", 0) {}

    function id() external pure returns (string memory _name) {
        return "esQiji";
    }
}
