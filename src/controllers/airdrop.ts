export const airdropNFT = async (
  contractAddress: string,
  recipient: string,
  quantity: number
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
};
