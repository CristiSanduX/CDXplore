//
//  PassportSummaryView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//


import SwiftUI

struct PassportSummaryView: View {
    let stats: PassportStats

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Summary")
                .font(.system(size: 18, weight: .bold))

            Text("\(stats.visited) of \(stats.total) countries visited")
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(.secondary)

            ProgressView(value: stats.progress)
                .tint(.black)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 18)
                .fill(Color.black.opacity(0.04))
        )
    }
}
