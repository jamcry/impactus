import React from "react";
import Page from "../component/page/Page";
import {Divider, Flex, Grid, Heading, Image, Text} from "@chakra-ui/react";
import ThreeBoxes from "../dummy/ThreeBoxes";
import {nftContractAbi} from "../contract/nftContractAbi";
import {useEtherProvider} from "../connection/EtherProviderContext";
import {ethers} from "ethers";
import {useQuery} from "react-query";
import {NFT_IDS} from "../contract/nftConstants";
import {getIpfsImageLink, getIpfsHashFromUrl} from "../contract/nftUtils";

interface MyAccountPageProps {}

function useNFTContract() {
  const {providerState, defaultAccount} = useEtherProvider();
  if (providerState.status !== "connected") {
    throw new Error("provider not connected");
  }

  const nftContract = new ethers.Contract(
    "0xc2b2417056d6d9031992E8935256A99e7b4Df9e7",
    nftContractAbi,
    providerState.provider
  );
  console.log({
    nftContract
  });

  const getMyNFTs = async () => {
    const myNFTs = await nftContract.balanceOfBatch(
      // an array of the same address repeated length of NFT_IDS times
      Array.from({length: NFT_IDS.length}, () => defaultAccount),
      NFT_IDS
    );
    const myNFTsWithData = await Promise.all(
      myNFTs.map(async (nft: any, index: number) => {
        const nftDataJsonUrl = await nftContract.uri(NFT_IDS[index]);
        let nftData = {};

        try {
          const nftDataRes = await fetch(nftDataJsonUrl);
          const nftDataResJson = await nftDataRes.json();
          nftData = nftDataResJson;
          console.log({
            nftDataRes,
            nftDataResJson
          });
        } catch (e) {
          console.log({
            e
          });
        }

        return {
          ...nft,
          ownedAmount: parseInt(nft._hex),
          jsonUrl: nftDataJsonUrl,
          ...nftData
        };
      })
    );
    return myNFTsWithData;
  };

  return {
    nftContract,
    getMyNFTs
  };
}

function MyAccountPage(props: MyAccountPageProps) {
  const {nftContract, getMyNFTs} = useNFTContract();
  const getMyNFTsQuery = useQuery(
    "getMyNFTs",
    async () => {
      return await getMyNFTs();
    },
    {
      onSuccess: (data) => {
        console.log(data);
      }
    }
  );

  return (
    <Page>
      <Heading>My Account</Heading>

      <Divider my={"20px"} />

      <Heading size={"md"} mb={"12px"}>
        My Donations
      </Heading>

      <ThreeBoxes />

      <Divider my={"20px"} />

      <Heading size={"md"} mb={"12px"}>
        My NFTS
      </Heading>

      <Grid templateColumns={"repeat(4, 1fr)"} gap={"12px"}>
        {getMyNFTsQuery.data
          ?.filter((nft) => Boolean(nft.ownedAmount))
          .map((nft: any) => {
            return (
              // TODO: SKELETEON
              <Grid
                gap={"6px"}
                key={nft.image}
                border={"1px solid"}
                borderColor={"gray.400"}
                borderRadius={"10px"}
                padding={"15px"}>
                <Image
                  width={"100%"}
                  aspectRatio={"1/1"}
                  src={getIpfsImageLink(getIpfsHashFromUrl(nft.image))}
                  alt={nft.name}
                />

                <Heading size={"md"} mb={"12px"}>
                  {nft.name}
                </Heading>

                <Text>{nft.description}</Text>
              </Grid>
            );
          })}
      </Grid>
    </Page>
  );
}

export default MyAccountPage;
