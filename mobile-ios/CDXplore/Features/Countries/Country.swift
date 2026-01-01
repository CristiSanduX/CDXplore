//
//  Country.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//

import Foundation

struct Country: Identifiable, Hashable, Comparable {

    let code: String
    let name: String
    let continent: String

    // MARK: - Identity

    var id: String { code }

    // MARK: - Init (normalizare centralizată)

    init(code: String, name: String, continent: String) {
        self.code = code.uppercased()
        self.name = name
        self.continent = Country.normalizeContinent(continent)
    }

    // MARK: - Flag emoji (safe)

    var flag: String {
        let upper = code.uppercased()
        guard upper.count == 2 else { return "🏳️" }

        let base: UInt32 = 127397
        var scalars = String.UnicodeScalarView()

        for v in upper.unicodeScalars {
            guard let scalar = UnicodeScalar(base + v.value) else {
                return "🏳️"
            }
            scalars.append(scalar)
        }

        return String(scalars)
    }

    // MARK: - Helpers

    private static func normalizeContinent(_ raw: String) -> String {
        switch raw.lowercased() {
        case "europe": return "Europe"
        case "asia": return "Asia"
        case "africa": return "Africa"
        case "north america": return "North America"
        case "south america": return "South America"
        case "oceania": return "Oceania"
        default: return raw
        }
    }

    // MARK: - Comparable (A–Z by name)

    static func < (lhs: Country, rhs: Country) -> Bool {
        lhs.name < rhs.name
    }
}
