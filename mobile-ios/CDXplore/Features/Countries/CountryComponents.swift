//
//  CountryComponents.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//

import SwiftUI

struct CountryCard: View {
    let country: Country
    let isVisited: Bool
    let onToggle: () -> Void

    var body: some View {
        Button(action: onToggle) {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Text(country.flag).font(.system(size: 28))
                    Spacer()
                    Image(systemName: isVisited ? "checkmark.seal.fill" : "circle")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundStyle(isVisited ? Color.green : Color.secondary)
                }

                Text(country.name)
                    .font(.system(size: 15, weight: .bold))
                    .lineLimit(1)

                Text(country.continent)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(.secondary)
            }
            .padding(14)
            .frame(maxWidth: .infinity, minHeight: 104, alignment: .leading)
            .background(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(Color.white)
                    .shadow(color: Color.black.opacity(0.08), radius: 10, x: 0, y: 6)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .stroke(Color.black.opacity(isVisited ? 0.14 : 0.08), lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
    }
}

struct CountryRow: View {
    let country: Country
    let isVisited: Bool
    let onToggle: () -> Void

    var body: some View {
        Button(action: onToggle) {
            HStack(spacing: 12) {
                Text(country.flag).font(.system(size: 26))

                VStack(alignment: .leading, spacing: 2) {
                    Text(country.name).font(.system(size: 15, weight: .bold))
                    Text(country.continent)
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(.secondary)
                }

                Spacer()

                Image(systemName: isVisited ? "checkmark.circle.fill" : "circle")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundStyle(isVisited ? Color.green : Color.secondary)
            }
            .padding(14)
            .background(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(Color.white)
                    .shadow(color: Color.black.opacity(0.06), radius: 8, x: 0, y: 5)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .stroke(Color.black.opacity(0.08), lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
    }
}

struct CountriesEmptyState: View {
    var body: some View {
        VStack(spacing: 10) {
            Text("No results")
                .font(.system(size: 18, weight: .bold))
            Text("Try a different search or turn off filters.")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.top, 40)
    }
}
