import { AppError, commonProtocol } from '@hicommonwealth/core';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { CommunityAttributes } from '../../models/community';
import { getNamespace } from './contractHelpers';

export const validateCommunityStakeConfig = async (
  community: CommunityAttributes,
  id: number,
) => {
  if (!community.ChainNode?.eth_chain_id || !community.namespace) {
    throw new AppError('Invalid community');
  }
  const chain_id = community.ChainNode.eth_chain_id;
  if (!Object.values(commonProtocol.ValidChains).includes(chain_id)) {
    throw new AppError(
      "Community Stakes not configured for community's chain node",
    );
  }
  const factoryData =
    commonProtocol.factoryContracts[chain_id as commonProtocol.ValidChains];
  const web3 = new Web3(community.ChainNode.url);
  const namespaceAddress = await getNamespace(
    web3,
    community.namespace,
    factoryData.factory,
  );
  const communityStakes = new web3.eth.Contract(
    [
      {
        inputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
        name: 'whitelist',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
      },
    ] as AbiItem[],
    factoryData.communityStake,
  );
  const whitelisted = await communityStakes.methods
    .whitelist(namespaceAddress, id)
    .call();
  if (!whitelisted) {
    return new AppError('Community Stake not configured');
  }
};
