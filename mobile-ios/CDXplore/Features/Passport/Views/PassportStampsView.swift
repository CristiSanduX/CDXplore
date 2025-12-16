//
//  PassportStampsView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//


import SwiftUI

struct PassportStampsView: View {
    let countries: [Country]

    var body: some View {
        let cols = [
            GridItem(.flexible()),
            GridItem(.flexible()),
            GridItem(.flexible())
        ]

        VStack(alignment: .leading, spacing: 12) {
            Text("Stamps")
                .font(.system(size: 18, weight: .bold))

            LazyVGrid(columns: cols, spacing: 12) {
                ForEach(countries) { country in
                    StampView(country: country)
                }
            }
        }
    }
}
