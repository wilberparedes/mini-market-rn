package com.minimarketrn

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import java.text.NumberFormat
import java.util.Locale

class CurrencyFormatterModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "CurrencyFormatter"

    @ReactMethod
    fun format(
        amount: Double,
        currency: String,
        locale: String?,
        promise: Promise
    ) {
        try {
            val formatter = if (locale.isNullOrBlank()) {
                NumberFormat.getCurrencyInstance()
            } else {
                NumberFormat.getCurrencyInstance(
                    Locale.forLanguageTag(locale)
                )
            }
            formatter.currency = java.util.Currency.getInstance(currency)
            promise.resolve(formatter.format(amount))
        } catch (error: Exception) {
            promise.reject(
                "CURRENCY_FORMAT_ERROR",
                "Unable to format currency",
                error
            )
        }
    }
}