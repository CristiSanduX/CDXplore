//
//  Country.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//


import Foundation

struct Country: Identifiable, Hashable {
    let code: String
    let name: String
    let continent: String

    var id: String { code }

    var flag: String {
        let base: UInt32 = 127397
        var s = ""
        for v in code.uppercased().unicodeScalars {
            guard let scalar = UnicodeScalar(base + v.value) else { continue }
            s.unicodeScalars.append(scalar)
        }
        return s
    }
}
