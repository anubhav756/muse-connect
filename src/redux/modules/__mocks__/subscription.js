export function usePromo(promoID, callback) {
  callback(true);
  callback(null);
  callback(null, 'test_checkoutURL');
}