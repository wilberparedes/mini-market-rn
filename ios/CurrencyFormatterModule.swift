import Foundation

@objc(CurrencyFormatter)
class CurrencyFormatter: NSObject {

  @objc
  func format(
    _ amount: NSNumber,
    currency: NSString,
    locale: NSString?,
    resolve: RCTPromiseResolveBlock,
    reject: RCTPromiseRejectBlock
  ) {
    let formatter = NumberFormatter()
    formatter.numberStyle = .currency
    formatter.currencyCode = currency as String

    if let locale = locale {
      formatter.locale = Locale(identifier: locale as String)
    }
    guard let result = formatter.string(from: amount) else {
      reject(
        "CURRENCY_FORMAT_ERROR",
        "Unable to format currency",
        nil
      )
      return
    }
    resolve(result)
  }
}