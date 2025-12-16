//
//  StampView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//


import SwiftUI

struct StampView: View {
    let country: Country

    var body: some View {
        VStack(spacing: 6) {
            Text(country.flag)
                .font(.system(size: 34))

            Text(country.code)
                .font(.system(size: 11, weight: .heavy))
                .tracking(1.2)

            Text(country.name)
                .font(.system(size: 10, weight: .semibold))
                .lineLimit(1)
                .foregroundStyle(.secondary)
        }
        .padding(10)
        .frame(height: 92)
        .frame(maxWidth: .infinity)
        .background(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(Color.white)
                .shadow(color: .black.opacity(0.08), radius: 6, y: 4)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(Color.black.opacity(0.12), lineWidth: 1)
        )
    }
}
