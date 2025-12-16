//
//  PassportStats.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//


import Foundation

struct PassportStats {
    let visited: Int
    let total: Int
    let byContinent: [String: (visited: Int, total: Int)]

    var progress: Double {
        total == 0 ? 0 : Double(visited) / Double(total)
    }
}
