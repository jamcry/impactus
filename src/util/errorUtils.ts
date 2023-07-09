const DEFAULT_ERROR_MESSAGE = "Something went wrong. Check the console.";

function getErrorMessage(error: unknown) {
  const extractedErrorMessage =
    (error as any)?.reason || (error as any)?.data?.message || (error as any)?.message;

  if (extractedErrorMessage) {
    if (extractedErrorMessage.includes("Expected nonce to be")) {
      console.log({
        extractedErrorMessage,
        error
      });
      return "Please reset your wallet on MetaMask, then try again. (Nonce mismatch error, check console for more information.)";
    }
    return extractedErrorMessage;
  }

  console.error(error);
  return DEFAULT_ERROR_MESSAGE;
}

export {getErrorMessage};
