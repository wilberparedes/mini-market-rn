#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CurrencyFormatter, NSObject)

RCT_EXTERN_METHOD(
  format:(nonnull NSNumber *)amount
  currency:(NSString *)currency
  locale:(NSString * _Nullable)locale
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

@end