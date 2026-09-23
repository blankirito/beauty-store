type OnboardingAccessInput = {
  hasMerchantIntent: boolean;
  hasOwnerMembership: boolean;
};

export function canAccessOnboarding({
  hasMerchantIntent,
  hasOwnerMembership,
}: OnboardingAccessInput) {
  return hasMerchantIntent || hasOwnerMembership;
}