async function createCampaign(zeronaut, campaignId) {
  await zeronaut.createCampaign(campaignId);
}

module.exports = {
  createCampaign,
};
