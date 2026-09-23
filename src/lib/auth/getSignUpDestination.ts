export function getSignUpDestination(isMerchantRegistration: boolean) {
  return isMerchantRegistration ? "/onboarding" : "/";
}