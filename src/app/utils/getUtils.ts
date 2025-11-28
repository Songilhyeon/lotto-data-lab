export const getLatestRound = () => {
  const firstDrawDate = new Date("2002-12-07");
  const today = new Date();
  return (
    Math.floor(
      (today.getTime() - firstDrawDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    ) + 1
  );
};

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL;

export const apiUrl = getApiUrl();
