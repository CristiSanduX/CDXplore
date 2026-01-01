//
//  CountryComponents.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//

import SwiftUI

// brand burgundy
private let ink = Color(red: 0.48, green: 0.12, blue: 0.23)

struct CountryCard: View {
    let country: Country
    let isVisited: Bool
    let onToggle: () -> Void

    @State private var pressed = false

    var body: some View {
        Button {
            onToggle()
        } label: {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Text(country.flag)
                        .font(.system(size: 28))

                    Spacer()

                    ZStack {
                        Circle()
                            .fill(Color.black.opacity(0.04))
                            .frame(width: 28, height: 28)

                        Image(systemName: isVisited ? "checkmark.seal.fill" : "circle")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundStyle(isVisited ? ink : Color.secondary)
                    }
                    .overlay(
                        Circle().stroke(Color.black.opacity(isVisited ? 0.16 : 0.10), lineWidth: 1)
                    )
                }

                Text(country.name)
                    .font(.system(size: 15, weight: .bold))
                    .lineLimit(1)

                Text(country.continent)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
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
                    .stroke(Color.black.opacity(isVisited ? 0.16 : 0.08), lineWidth: 1)
            )
            .scaleEffect(pressed ? 0.985 : 1)
            .opacity(pressed ? 0.98 : 1)
            .animation(.spring(response: 0.28, dampingFraction: 0.86), value: pressed)
        }
        .buttonStyle(.plain)
        .onLongPressGesture(minimumDuration: 0.01, maximumDistance: 18, pressing: { p in
            pressed = p
        }, perform: { })
        .accessibilityLabel(Text("\(country.name), \(isVisited ? "visited" : "not visited")"))
    }
}

struct CountryRow: View {
    let country: Country
    let isVisited: Bool
    let onToggle: () -> Void

    @State private var pressed = false

    var body: some View {
        Button {
            onToggle()
        } label: {
            HStack(spacing: 12) {
                Text(country.flag)
                    .font(.system(size: 26))

                VStack(alignment: .leading, spacing: 2) {
                    Text(country.name)
                        .font(.system(size: 15, weight: .bold))
                        .lineLimit(1)

                    Text(country.continent)
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }

                Spacer()

                ZStack {
                    Circle()
                        .fill(Color.black.opacity(0.04))
                        .frame(width: 28, height: 28)

                    Image(systemName: isVisited ? "checkmark.circle.fill" : "circle")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundStyle(isVisited ? ink : Color.secondary)
                }
                .overlay(
                    Circle().stroke(Color.black.opacity(isVisited ? 0.16 : 0.10), lineWidth: 1)
                )
            }
            .padding(14)
            .background(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(Color.white)
                    .shadow(color: Color.black.opacity(0.06), radius: 8, x: 0, y: 5)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .stroke(Color.black.opacity(isVisited ? 0.14 : 0.08), lineWidth: 1)
            )
            .scaleEffect(pressed ? 0.992 : 1)
            .opacity(pressed ? 0.985 : 1)
            .animation(.spring(response: 0.28, dampingFraction: 0.86), value: pressed)
        }
        .buttonStyle(.plain)
        .onLongPressGesture(minimumDuration: 0.01, maximumDistance: 18, pressing: { p in
            pressed = p
        }, perform: { })
        .accessibilityLabel(Text("\(country.name), \(isVisited ? "visited" : "not visited")"))
    }
}

struct CountriesEmptyState: View {
    var body: some View {
        VStack(spacing: 10) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 22, weight: .bold))
                .foregroundStyle(Color.black.opacity(0.55))

            Text("No results")
                .font(.system(size: 18, weight: .bold))

            Text("Try a different search or turn off filters.")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.top, 40)
    }
}
