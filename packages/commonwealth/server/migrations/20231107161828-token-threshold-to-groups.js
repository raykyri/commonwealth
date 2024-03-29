'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      // get threshold values for all topics greater than zero
       const [topics] = await queryInterface.sequelize.query(
        `
        SELECT
          "Topics".id as topic_id,
          "Topics".name as topic_name,
          "Topics".description as topic_description,
          "Topics".chain_id as topic_chain_id,
          "Topics".token_threshold,
          "Communities".network,
          "Communities".default_symbol as token_symbol,
          "ChainNodes".eth_chain_id,
          "ChainNodes".cosmos_chain_id,
          "Contracts".address as contract_address
        FROM "Topics"
        JOIN "Communities" ON "Communities".id = "Topics".chain_id
        JOIN "ChainNodes" ON "ChainNodes".id = "Communities".chain_node_id
        JOIN "CommunityContracts" ON "CommunityContracts".chain_id = "Topics".chain_id
        JOIN "Contracts" ON "Contracts".id = "CommunityContracts".contract_id
        WHERE
          ("ChainNodes".eth_chain_id IS NOT NULL OR "ChainNodes".cosmos_chain_id IS NOT NULL) AND
          "Topics".token_threshold NOT IN ('0', '0000000000000000000') AND
          "Topics".deleted_at IS NULL
        `
      )

      // for each topic, create a new group for it
      for (const topic of topics) {
        const {
          topic_id,
          topic_name,
          topic_description,
          topic_chain_id,
          token_threshold,
          network,
          token_symbol,
          contract_address,
          eth_chain_id,
          cosmos_chain_id
        } = topic
         // build new group
        const source = (() => {
          switch (network) {
            case 'erc20':
            case 'erc721':
              // ContractSource
              return {
                source_type: network,
                evm_chain_id: eth_chain_id,
                contract_address
              }
            case 'ethereum':
              // NativeSource
              return {
                source_type: 'eth_native',
                evm_chain_id: eth_chain_id
              }
            case 'cosmos':
              // CosmosSource
              return {
                source_type: 'cosmos_native',
                cosmos_chain_id,
                token_symbol
              }
            default:
              return null
          }
        })()
        if (!source) {
          console.log(`skipped topic ${topic_id} due to unsupported network ${network}`)
          continue
        }
        const metadata = {
          name: `${token_symbol} Holders`,
          description: `Autogenerated`,
          required_requirements: 1
        }
        const requirements = [
          {
            rule: 'threshold',
            data: {
              threshold: token_threshold,
              source
            }
          }
        ]
        // check for existing matching group
        const existingGroupId = await findGroup(queryInterface, topic_chain_id, requirements)
        if (existingGroupId) {
          // found existing group- add to topic
          await addGroupIdToTopic(queryInterface, existingGroupId, topic_id)
        } else {
          // does not exist- create group then add to topic
          const createdGroupId = await insertGroup(queryInterface, topic_chain_id, metadata, requirements)
          if (createdGroupId) {
            await addGroupIdToTopic(queryInterface, createdGroupId, topic_id)
          }
        }
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(`DELETE FROM "Memberships"`, { transaction })
      await queryInterface.sequelize.query(`DELETE FROM "Groups"`, { transaction })
      await queryInterface.sequelize.query(`
        UPDATE "Topics"
        SET group_ids = ARRAY[]::integer[];
      `, { transaction })
    })
  }
};

async function findGroup(queryInterface, community_id, requirements) {
  const findGroupQuery = `
    SELECT id
    FROM "Groups"
    WHERE community_id = :community_id AND requirements::text = :requirements::text
  `;
  const result = await queryInterface.sequelize.query(findGroupQuery, {
    replacements: {
      community_id,
      requirements: JSON.stringify(requirements, null, 2)
    },
    type: queryInterface.sequelize.QueryTypes.SELECT
  });

  if (result.length > 0) {
    const { id: existingGroupId } = result[0];
    return existingGroupId;
  } else {
    return null;
  }
}


async function addGroupIdToTopic(queryInterface, groupId, topicId) {
  console.log(`adding group ${groupId} to topic ${topicId}`)
  const updateTopicQuery = `
    UPDATE "Topics" SET "group_ids" = "group_ids" || ARRAY[${groupId}] WHERE id = ${topicId} AND deleted_at IS NULL
  `
  return queryInterface.sequelize.query(updateTopicQuery)
}

async function insertGroup(queryInterface, community_id, metadata, requirements) {
  console.log(`inserting new group to community ${community_id}`)
  const insertGroupQuery = `
    INSERT INTO "Groups"
        ("community_id", "metadata", "requirements", "created_at", "updated_at")
      VALUES
        (:community_id, :metadata, :requirements, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id
  `
  const [[{ id: createdGroupId }]] = await queryInterface.sequelize.query(insertGroupQuery, {
    replacements: {
      community_id,
      metadata: JSON.stringify(metadata, null, 2),
      requirements: JSON.stringify(requirements, null, 2)
    },
    type: queryInterface.sequelize.QueryTypes.INSERT
  });
  return createdGroupId
}
