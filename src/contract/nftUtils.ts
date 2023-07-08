function getIpfsHashFromUrl(url: string) {
  const ipfsHash = url.split("//")[1];
  return ipfsHash;
}

function getIpfsImageLink(ipfsHash: string) {
  return `https://ipfs.io/ipfs/${ipfsHash}`;
}

export {getIpfsHashFromUrl, getIpfsImageLink};
