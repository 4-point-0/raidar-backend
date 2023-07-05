export const getFileForNullCampaignQuery = (id: string) => {
  return {
    where: { id, campaign_id: null },
  };
};

export const getFilesByCampaignIdQuery = (campaign_id: string) => {
  return {
    where: {
      campaign_id,
    },
  };
};
