import AsyncStorage from '@react-native-community/async-storage';

type LastPurchase = { productId: string; courseId: string };
type UnfinishedPurchase = LastPurchase & { transactionId: string };

const unfinishedKey = 'IAPUnfinishedCoursePurchases';
const lastPurchaseKey = 'IAPLastCoursePurchase';
const unfinishedMembershipKey = 'IAPHasUnfinishedMembershipPurchase';

const getUnfinishedPurchases = async (): Promise<UnfinishedPurchase[]> => {
  const unfinished = await AsyncStorage.getItem(unfinishedKey);
  const parsed = unfinished && JSON.parse(unfinished);
  return Array.isArray(parsed) ? parsed : [];
};

export const storage = {
  setLastPurchase: async (lastPurchase: LastPurchase) => {
    await AsyncStorage.setItem(lastPurchaseKey, JSON.stringify(lastPurchase));
  },

  getLastPurchase: async (): Promise<LastPurchase | null> => {
    const lastPurchase = await AsyncStorage.getItem(lastPurchaseKey);
    return lastPurchase && JSON.parse(lastPurchase);
  },

  removeLastPurchase: async () => AsyncStorage.removeItem(lastPurchaseKey),

  addUnfinishedPurchase: async (unfinishedPurchase: UnfinishedPurchase) => {
    const unfinished = await AsyncStorage.getItem(unfinishedKey);
    const parsed = unfinished && JSON.parse(unfinished);
    const existingUnfinished = Array.isArray(parsed) ? parsed : [];
    await AsyncStorage.setItem(
      unfinishedKey,
      JSON.stringify(existingUnfinished.concat(unfinishedPurchase)),
    );
  },

  getUnfinishedPurchase: async (transactionId: string): Promise<UnfinishedPurchase | null> => {
    const unfinishedPurchases = await getUnfinishedPurchases();
    return (
      (transactionId && unfinishedPurchases.find(u => u.transactionId === transactionId)) || null
    );
  },

  removeUnfinishedPurchase: async (transactionId: string) => {
    const unfinishedPurchases = await getUnfinishedPurchases();
    await AsyncStorage.setItem(
      unfinishedKey,
      JSON.stringify(unfinishedPurchases.filter(u => u.transactionId !== transactionId)),
    );
  },

  setHasUnfinishedMembership: async () => AsyncStorage.setItem(unfinishedMembershipKey, 'true'),
  removeUnfinishedMembership: async () => AsyncStorage.removeItem(unfinishedMembershipKey),
  getHasUnfinishedMembership: async () => AsyncStorage.getItem(unfinishedMembershipKey),
};
