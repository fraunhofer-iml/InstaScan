/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { TokenAssetDto, TokenHierarchyDto, TokenMetadataDto, TokenReadDto } from 'nft-folder-blockchain-connector-besu';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NFT_ADDRESS, NFT_MINTER_ADDRESS, NFT_OWNER_ADDRESS } from '../nfts/util/nft.constants';

@Entity()
export class Nft {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  remoteId: string;
  @Column()
  ownerAddress: string;
  @Column()
  minterAddress: string;
  @Column()
  createdOn: Date;
  @Column()
  lastUpdatedOn: Date;
  @Column()
  tokenAddress: string;
  @Column()
  assetInvoiceUrl: string;
  @Column()
  assetInvoiceHash: string;
  @Column()
  metadataUrl: string;
  @Column()
  metadataHash: string;
  @Column()
  additionalData: string;

  constructor(
    remoteId: string,
    assetInvoiceUrl: string,
    assetInvoiceHash: string,
    metadataUrl: string,
    metadataHash: string,
    additionalData: string
  ) {
    this.remoteId = remoteId;
    this.ownerAddress = NFT_OWNER_ADDRESS;
    this.minterAddress = NFT_MINTER_ADDRESS;
    this.createdOn = new Date();
    this.lastUpdatedOn = new Date();
    this.tokenAddress = NFT_ADDRESS;
    this.assetInvoiceUrl = assetInvoiceUrl;
    this.assetInvoiceHash = assetInvoiceHash;
    this.metadataUrl = metadataUrl;
    this.metadataHash = metadataHash;
    this.additionalData = additionalData;
  }

  public toTokenReadDto(): TokenReadDto {
    return new TokenReadDto(
      this.remoteId,
      new TokenAssetDto(this.assetInvoiceUrl, this.assetInvoiceHash),
      new TokenMetadataDto(this.metadataUrl, this.metadataHash),
      this.additionalData,
      new TokenHierarchyDto(false, [], []),
      this.ownerAddress,
      this.minterAddress,
      this.createdOn.toISOString(),
      this.lastUpdatedOn.toISOString(),
      this.id,
      this.tokenAddress
    );
  }

  public static fromTokenReadDto(tokenReadDto: TokenReadDto): Nft {
    const newNft = new Nft(
      tokenReadDto.remoteId,
      tokenReadDto.asset.uri,
      tokenReadDto.asset.hash,
      tokenReadDto.metadata.uri,
      tokenReadDto.metadata.hash,
      tokenReadDto.additionalData
    );
    newNft.createdOn = new Date(tokenReadDto.createdOn);
    newNft.lastUpdatedOn = new Date(tokenReadDto.lastUpdatedOn);
    return newNft;
  }
}
