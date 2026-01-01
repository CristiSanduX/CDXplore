//
//  StampView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//

import SwiftUI

struct StampView: View {
    let country: Country
    let visitedAt: Date?

    @Binding var expandedCode: String?
    private var isExpanded: Bool { expandedCode == country.code.uppercased() }

    // sheet state
    @State private var showDetails = false

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            let stampSide = side * (isExpanded ? 0.98 : 0.92)

            ZStack {
                if let img = stampImage(for: country.code) {
                    img
                        .resizable()
                        .scaledToFit()
                        .frame(width: stampSide, height: stampSide)
                        .shadow(color: .black.opacity(0.10), radius: 14, x: 0, y: 10)
                        .opacity(0.98)
                        .accessibilityLabel(Text("Stamp \(country.code.uppercased())"))
                } else {
                    // Fallback: generated seal (same, but no rotation)
                    StampSeal(
                        code: country.code,
                        fallbackEmoji: landmarkEmoji(for: country.code),
                        ink: Color(red: 0.48, green: 0.12, blue: 0.23)
                    )
                    .frame(width: stampSide, height: stampSide)
                    .opacity(0.98)
                }
            }
            .frame(width: geo.size.width, height: geo.size.height, alignment: .center)
            .contentShape(Rectangle())
            .onTapGesture {
                withAnimation(.spring(response: 0.34, dampingFraction: 0.86)) {
                    let code = country.code.uppercased()
                    expandedCode = (expandedCode == code) ? nil : code
                }
                // open details
                showDetails = true
            }
            .animation(.spring(response: 0.34, dampingFraction: 0.86), value: isExpanded)
            .sheet(isPresented: $showDetails) {
                StampDetailsSheet(country: country, visitedAt: visitedAt)
                    .presentationDetents([.medium, .large])
                    .presentationDragIndicator(.visible)
            }
        }
        .clipped()
    }

    // MARK: - Helpers

    private func stampImage(for code: String) -> Image? {
        let name = "stamp_\(code.uppercased())"
        if UIImage(named: name) != nil { return Image(name) }
        return nil
    }

    private func landmarkEmoji(for code: String) -> String {
        switch code.uppercased() {
        case "FR": return "🗼"
        case "US": return "🗽"
        case "GB": return "🎡"
        case "IT": return "🏛️"
        case "ES": return "💃"
        case "DE": return "🏰"
        case "JP": return "⛩️"
        case "CN": return "🏯"
        case "KR": return "🏯"
        case "GR": return "🏛️"
        case "EG": return "🛕"
        case "TR": return "🕌"
        case "AE": return "🏙️"
        case "BR": return "⛪️"
        case "AR": return "🏔️"
        case "CA": return "🍁"
        case "AU": return "🦘"
        case "NZ": return "🌿"
        case "RO": return "🏰"
        default: return "🌍"
        }
    }
}

// MARK: - Details Sheet

private struct StampDetailsSheet: View {
    let country: Country
    let visitedAt: Date?

    // same premium ink
    private let ink = Color(red: 0.48, green: 0.12, blue: 0.23)

    var body: some View {
        let facts = CountryFactsProvider.facts(for: country.code)

        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 14) {

                // Header
                HStack(alignment: .top, spacing: 12) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text(country.name)
                            .font(.system(size: 22, weight: .black))
                            .tracking(0.2)

                        Text(country.continent)
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(.secondary)

                        if let d = visitedAt {
                            Text("Visited: \(longDate(d))")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundStyle(Color.black.opacity(0.55))
                        }
                    }

                    Spacer()

                    // optional mini flag badge in sheet (not on stamp)
                    Text(flagEmoji(country.code))
                        .font(.system(size: 28))
                        .padding(10)
                        .background(
                            RoundedRectangle(cornerRadius: 16, style: .continuous)
                                .fill(Color.black.opacity(0.04))
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 16, style: .continuous)
                                .stroke(Color.black.opacity(0.08), lineWidth: 1)
                        )
                }

                // Big stamp preview (no rotation)
                Group {
                    if let img = stampImage(for: country.code) {
                        img
                            .resizable()
                            .scaledToFit()
                            .frame(maxWidth: .infinity)
                            .frame(height: 260)
                            .shadow(color: .black.opacity(0.10), radius: 18, x: 0, y: 12)
                            .padding(.top, 2)
                    } else {
                        StampSeal(
                            code: country.code,
                            fallbackEmoji: "🌍",
                            ink: ink
                        )
                        .frame(maxWidth: .infinity)
                        .frame(height: 240)
                    }
                }
                .frame(maxWidth: .infinity)
                .background(
                    RoundedRectangle(cornerRadius: 26, style: .continuous)
                        .fill(Color.black.opacity(0.03))
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 26, style: .continuous)
                        .stroke(Color.black.opacity(0.06), lineWidth: 1)
                )

                // Facts (5 items)
                VStack(spacing: 10) {
                    FactRow(title: "Capital", value: facts.capital)
                    FactRow(title: "Population", value: facts.population)
                    FactRow(title: "Area", value: facts.area)
                    FactRow(title: "Currency", value: facts.currency)
                    FactRow(title: "Language", value: facts.language)
                }
                .padding(14)
                .background(
                    RoundedRectangle(cornerRadius: 22, style: .continuous)
                        .fill(Color.black.opacity(0.04))
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 22, style: .continuous)
                        .stroke(Color.black.opacity(0.06), lineWidth: 1)
                )

                // optional extra “passport” line
                Text("ISO code: \(country.code.uppercased())")
                    .font(.system(size: 12, weight: .bold, design: .monospaced))
                    .foregroundStyle(Color.black.opacity(0.55))
                    .padding(.top, 2)
            }
            .padding(16)
        }
    }

    // local helpers duplicated here for privacy of file scope
    private func stampImage(for code: String) -> Image? {
        let name = "stamp_\(code.uppercased())"
        if UIImage(named: name) != nil { return Image(name) }
        return nil
    }

    private func flagEmoji(_ countryCode: String) -> String {
        let code = countryCode.uppercased()
        guard code.count == 2 else { return "🏳️" }
        let scalars = code.unicodeScalars.compactMap { scalar -> UnicodeScalar? in
            guard let v = UnicodeScalar(127397 + Int(scalar.value)) else { return nil }
            return v
        }
        return String(String.UnicodeScalarView(scalars))
    }

    private func longDate(_ d: Date) -> String {
        let f = DateFormatter()
        f.locale = Locale(identifier: "ro_RO")
        f.dateFormat = "dd MMMM yyyy"
        return f.string(from: d)
    }
}

private struct FactRow: View {
    let title: String
    let value: String

    var body: some View {
        HStack(alignment: .firstTextBaseline) {
            Text(title)
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(.secondary)
                .frame(width: 90, alignment: .leading)

            Text(value)
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(Color.black.opacity(0.80))
                .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}

// MARK: - Country Facts Provider (fill this from your dataset)

private struct CountryFacts {
    let capital: String
    let population: String
    let area: String
    let currency: String
    let language: String
}

private enum CountryFactsProvider {
    // TODO: populate from your CountriesData (ideal),
    // or keep a separate dictionary file.
    static func facts(for code: String) -> CountryFacts {
        let c = code.uppercased()

        // Example entries (add more as you like)
        switch c {
        case "RO":
            return .init(
                capital: "Bucharest",
                population: "≈ 19M",
                area: "238,397 km²",
                currency: "RON",
                language: "Romanian"
            )
        case "FR":
            return .init(
                capital: "Paris",
                population: "≈ 68M",
                area: "551,695 km²",
                currency: "EUR",
                language: "French"
            )
        default:
            return .init(
                capital: "—",
                population: "—",
                area: "—",
                currency: "—",
                language: "—"
            )
        }
    }
}

// MARK: - Fallback Generated Stamp (only if no custom PNG exists)

private struct StampSeal: View {
    let code: String
    let fallbackEmoji: String
    let ink: Color

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            let emojiSize = min(48, max(40, side * 0.34))

            ZStack {
                Circle()
                    .stroke(ink.opacity(0.85), lineWidth: 3)
                    .overlay(
                        Circle()
                            .stroke(ink.opacity(0.28),
                                    style: StrokeStyle(lineWidth: 1, dash: [2, 7]))
                            .padding(9)
                    )

                Circle()
                    .fill(Color.white.opacity(0.95))
                    .padding(14)
                    .overlay(
                        Circle()
                            .stroke(ink.opacity(0.20), lineWidth: 1)
                            .padding(14)
                    )

                Text(fallbackEmoji)
                    .font(.system(size: emojiSize))
                    .shadow(color: .black.opacity(0.10), radius: 10, x: 0, y: 6)

                Text(code.uppercased())
                    .font(.system(size: 10, weight: .black, design: .monospaced))
                    .foregroundStyle(ink.opacity(0.85))
                    .padding(.top, side * 0.52)
            }
            .frame(width: geo.size.width, height: geo.size.height)
            .overlay(Circle().fill(.black.opacity(0.03)))
            .shadow(color: ink.opacity(0.18), radius: 14, x: 0, y: 10)
        }
    }
}
