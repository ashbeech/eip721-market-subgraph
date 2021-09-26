import { BigInt } from "@graphprotocol/graph-ts"
import {
  Market,
  AskPriceSet,
  MetaTransactionExecuted,
  NFTAddressSet,
  OwnershipTransferred,
  Paused,
  Sold,
  Unpaused
} from "../generated/Market/Market"
import { Token, Ownership } from "../generated/schema"

export function handleAskPriceSet(event: AskPriceSet): void {

  let tokenId = event.params._tokenID;
  let id = tokenId.toString();
  // if exists
  let token = Token.load(id);
  let i = BigInt.fromI32(0);
  let actor = event.params._actor;
  let prevOwnerAddress = token.ownerAddress;

  if (token == null) {
    // if first time
    token = new Token(id);
    token.numOwners = i;
    token.tokenID = tokenId;
    token.firstAddress = actor;

    token.firstTime = event.block.timestamp;
    token.nftAddress = event.params._nftAddress;

    i = token.numOwners.plus(BigInt.fromI32(1));
    token.numOwners = token.numOwners.plus(BigInt.fromI32(1));
    
    let ownerAddress = actor;
    let ownerId = ownerAddress.toHex() + '_' + id + '_' +  token.numOwners.toString();
    let ownership = Ownership.load(ownerId);

    token.actor = ownerAddress;
    token.ownerAddress = ownerAddress;
    token.value = event.params._value;
    token.prevOwnerAddress = prevOwnerAddress;
  
    if (ownership == null) {
      // first time
      ownership = new Ownership(ownerId);
      ownership.ownerNum = BigInt.fromI32(0);
    }
    ownership.tokenID = id;
    ownership.timestamp = event.block.timestamp;
    ownership.value = event.params._value;
    ownership.address = ownerAddress;
    ownership.ownerNum = i;
  
    ownership.save();
  }

  token.latestTime = event.block.timestamp;
  token.save();
}

export function handleMetaTransactionExecuted(
  event: MetaTransactionExecuted
): void {}

export function handleNFTAddressSet(event: NFTAddressSet): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePaused(event: Paused): void {}

export function handleSold(event: Sold): void {
   
  let tokenId = event.params._tokenID;
  let id = tokenId.toString();
  let from = event.transaction.from;
  // exists
  let token = Token.load(id);
  let prevOwnerAddress = token.ownerAddress;
  let i = BigInt.fromI32(0);
  
  if (token == null) {
    // first time
    token = new Token(id);

    token.numOwners = i;
    token.tokenID = tokenId;
    token.firstAddress = from;
    token.firstTime = event.block.timestamp;
    token.nftAddress = event.params._nftAddress;
  } 

  token.soldTime = event.block.timestamp;
  token.latestTime = event.block.timestamp;
  token.actor = event.params._actor;
  token.ownerAddress = from;
  token.value = event.params._value;
  token.prevOwnerAddress = prevOwnerAddress;

  i = token.numOwners.plus(BigInt.fromI32(1));
  token.numOwners = token.numOwners.plus(BigInt.fromI32(1));
  
  let ownerAddress = from;
  let ownerId = ownerAddress.toHex() + '_' + id + '_' +  token.numOwners.toString();
  let ownership = Ownership.load(ownerId);

  if (ownership == null) {
    // first time
    ownership = new Ownership(ownerId);
    ownership.ownerNum = BigInt.fromI32(0);
  }
  ownership.tokenID = id;
  ownership.timestamp = event.block.timestamp;
  ownership.value = event.params._value;
  ownership.address = from
  ownership.ownerNum = i;
  
  if (ownership.ownerNum == BigInt.fromI32(1)) {
    //token.firstTime = event.block.timestamp;
    //token.firstAddress = ownerAddress;
  }

  ownership.save();
  token.save();
}

export function handleUnpaused(event: Unpaused): void {}
