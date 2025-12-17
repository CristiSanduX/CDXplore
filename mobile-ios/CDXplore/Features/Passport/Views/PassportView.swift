//
//  PassportView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//

import SwiftUI

struct PassportView: View {

    @StateObject private var store = VisitedStore()
    @State private var spreadIndex: Int = 0

    private let allCountries = CountriesData.all

    private var visitedCountries: [Country] {
        allCountries.filter { store.visited.contains($0.code) }
            .sorted { $0.name < $1.name }
    }

    private var stats: PassportStats {
        let total = allCountries.count
        let visited = visitedCountries.count

        let byContinent = Dictionary(grouping: allCountries, by: \.continent)
            .mapValues { list in
                let v = list.filter { store.visited.contains($0.code) }.count
                return (visited: v, total: list.count)
            }

        return PassportStats(visited: visited, total: total, byContinent: byContinent)
    }

    private var progress: Double {
        let t = max(1, stats.total)
        return Double(stats.visited) / Double(t)
    }

    // MARK: - Spreads

    private var spreads: [SpreadFlipView.Spread] {
        var out: [SpreadFlipView.Spread] = []

        // 0) Cover (single)
        out.append(
            .init(
                left: AnyView(
                    VStack(spacing: 14) {
                        PassportCoverView()

                        Text("Swipe to open")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(.secondary)
                            .opacity(spreadIndex == 0 ? 1 : 0)
                            .animation(.spring(response: 0.35, dampingFraction: 0.9), value: spreadIndex)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
                ),
                right: AnyView(EmptyView()),
                isCover: true
            )
        )

        // 1) Inside spread: Identity + Summary
        out.append(.init(left: AnyView(identityPage), right: AnyView(summaryPage), isCover: false))

        // 2+) Stamps: one spread per page (NO pairing)
        let stampPages = buildStampPages(visitedCountries)
        for page in stampPages {
            out.append(.init(left: page, right: AnyView(stampsNotesPage), isCover: false))
        }

        return out
    }

    // MARK: - Identity

    private var identityPage: some View {
        ZStack {
            Image(systemName: "globe.europe.africa.fill")
                .font(.system(size: 140, weight: .bold))
                .foregroundStyle(Color.black.opacity(0.035))
                .rotationEffect(.degrees(-12))
                .offset(x: 44, y: 56)

            VStack(alignment: .leading, spacing: 12) {
                HStack(alignment: .firstTextBaseline) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Identity")
                            .font(.system(size: 18, weight: .black))
                        Text("OFFICIAL TRAVEL DOCUMENT")
                            .font(.system(size: 11, weight: .semibold, design: .rounded))
                            .tracking(1.8)
                            .foregroundStyle(.secondary)
                    }
                    Spacer()
                    Badge(text: "CDX", icon: "sparkles")
                }

                Card {
                    HStack(alignment: .top, spacing: 12) {
                        ZStack {
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .fill(Color.black.opacity(0.06))
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .stroke(Color.black.opacity(0.10), lineWidth: 1)

                            VStack(spacing: 8) {
                                Image(systemName: "person.crop.rectangle")
                                    .font(.system(size: 26, weight: .semibold))
                                    .foregroundStyle(Color.black.opacity(0.35))
                                Text("PHOTO")
                                    .font(.system(size: 10, weight: .bold, design: .rounded))
                                    .tracking(1.6)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        .frame(width: 92, height: 120)

                        VStack(alignment: .leading, spacing: 10) {
                            FieldRow(key: "Name", value: "CDXplorer")
                            FieldRow(key: "Nationality", value: "—")
                            FieldRow(key: "Passport No", value: "CDX-000127")
                            FieldRow(key: "Issued", value: "2025")
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                    }

                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("SIGNATURE")
                                .font(.system(size: 9, weight: .bold, design: .rounded))
                                .tracking(1.3)
                                .foregroundStyle(.secondary)

                            RoundedRectangle(cornerRadius: 8, style: .continuous)
                                .fill(Color.black.opacity(0.06))
                                .frame(height: 28)
                                .overlay(
                                    Text("Cristi Sandu")
                                        .font(.system(size: 13, weight: .semibold, design: .rounded))
                                        .foregroundStyle(Color.black.opacity(0.45))
                                        .padding(.horizontal, 10),
                                    alignment: .leading
                                )
                        }

                        Spacer()

                        Image(systemName: "wave.3.right")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundStyle(Color.black.opacity(0.22))
                    }
                    .padding(.top, 10)
                }

                Card {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("MRZ")
                            .font(.system(size: 9, weight: .bold, design: .rounded))
                            .tracking(1.6)
                            .foregroundStyle(.secondary)

                        VStack(spacing: 6) {
                            MRZLine("P<CDXCDXPLORER<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                            MRZLine("CDX000127<9CDX2501012M3001017<<<<<<<<<<<<<<")
                        }
                    }
                }

                Spacer(minLength: 0)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding(.top, 2)
    }

    // MARK: - Summary

    private var summaryPage: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .firstTextBaseline) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Summary")
                        .font(.system(size: 18, weight: .black))
                    Text("Your travel progress")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(.secondary)
                }
                Spacer()
                ProgressPill(progress: progress)
            }

            HStack(spacing: 10) {
                StatTile(title: "Visited", value: "\(stats.visited)", subtitle: "of \(stats.total)")
                StatTile(title: "Progress", value: "\(Int((progress * 100).rounded()))%", subtitle: "global")
            }

            Card {
                HStack(spacing: 14) {
                    ProgressRing(progress: progress)
                        .frame(width: 72, height: 72)

                    VStack(alignment: .leading, spacing: 6) {
                        Text("Overview")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(.secondary)

                        Text("\(stats.visited) / \(stats.total)")
                            .font(.system(size: 22, weight: .black))

                        let next = nextMilestone(stats.visited)
                        Text(next == nil ? "All milestones completed" : "Next milestone: \(next!)")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(Color.black.opacity(0.55))
                    }

                    Spacer()
                }

                Capsule()
                    .fill(Color.black.opacity(0.06))
                    .frame(height: 10)
                    .overlay(
                        GeometryReader { g in
                            let w = max(8, g.size.width * CGFloat(progress))
                            Capsule().fill(Color.black.opacity(0.75)).frame(width: w)
                        }
                    )
                    .frame(height: 10)
                    .padding(.top, 10)
            }

            // Compact continents: always fits
            Card {
                VStack(spacing: 10) {
                    ContinentRow(name: "Europe",
                                 v: stats.byContinent["Europe"]?.visited ?? 0,
                                 t: stats.byContinent["Europe"]?.total ?? 0)
                    DividerLine()
                    ContinentRow(name: "Asia",
                                 v: stats.byContinent["Asia"]?.visited ?? 0,
                                 t: stats.byContinent["Asia"]?.total ?? 0)
                    DividerLine()
                    ContinentRow(name: "Africa",
                                 v: stats.byContinent["Africa"]?.visited ?? 0,
                                 t: stats.byContinent["Africa"]?.total ?? 0)
                    DividerLine()
                    ContinentRow(name: "Americas",
                                 v: (stats.byContinent["North America"]?.visited ?? 0) + (stats.byContinent["South America"]?.visited ?? 0),
                                 t: (stats.byContinent["North America"]?.total ?? 0) + (stats.byContinent["South America"]?.total ?? 0))
                    DividerLine()
                    ContinentRow(name: "Oceania",
                                 v: stats.byContinent["Oceania"]?.visited ?? 0,
                                 t: stats.byContinent["Oceania"]?.total ?? 0)
                }
            }

            Spacer(minLength: 0)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    private struct DividerLine: View {
        var body: some View {
            Rectangle().fill(Color.black.opacity(0.06)).frame(height: 1).padding(.top, 2)
        }
    }

    private struct ContinentRow: View {
        let name: String
        let v: Int
        let t: Int

        var body: some View {
            let p = t == 0 ? 0.0 : Double(v) / Double(t)

            VStack(spacing: 6) {
                HStack {
                    Text(name)
                        .font(.system(size: 13, weight: .semibold))
                        .lineLimit(1)
                    Spacer()
                    Text("\(v)/\(t)")
                        .font(.system(size: 13, weight: .heavy))
                        .foregroundStyle(.secondary)
                }

                Capsule()
                    .fill(Color.black.opacity(0.06))
                    .frame(height: 8)
                    .overlay(
                        GeometryReader { g in
                            let w = max(6, g.size.width * CGFloat(p))
                            Capsule().fill(Color.black.opacity(0.65)).frame(width: w)
                        }
                    )
                    .frame(height: 8)
            }
        }
    }

    // MARK: - Stamps

    private var stampsNotesPage: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Travel Notes")
                .font(.system(size: 18, weight: .black))
            Text("Tips, memories, and highlights.")
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(.secondary)

            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(Color.black.opacity(0.04))
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.black.opacity(0.06), lineWidth: 1))
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .overlay(
                    Text("Coming soon…")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(.secondary),
                    alignment: .center
                )
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    private func buildStampPages(_ visited: [Country]) -> [AnyView] {
        // Bigger stamps: fewer per page
        let perPage = 9 // 3 x 3
        let chunks = stride(from: 0, to: visited.count, by: perPage).map {
            Array(visited[$0..<min($0 + perPage, visited.count)])
        }

        if chunks.isEmpty {
            return [
                AnyView(
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Stamps")
                            .font(.system(size: 18, weight: .black))
                        Text("No stamps yet")
                            .font(.system(size: 16, weight: .bold))
                        Text("Go to Countries and mark your first visit.")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(.secondary)
                        Spacer(minLength: 0)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                )
            ]
        }

        return chunks.enumerated().map { idx, chunk in
            AnyView(
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("Stamps")
                            .font(.system(size: 18, weight: .black))
                        Spacer()
                        Text("\(idx + 1)/\(chunks.count)")
                            .font(.system(size: 12, weight: .heavy))
                            .foregroundStyle(.secondary)
                    }

                    stampsGrid(chunk)
                    Spacer(minLength: 0)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            )
        }
    }

    private func stampsGrid(_ list: [Country]) -> some View {
        let cols = [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())]
        return LazyVGrid(columns: cols, spacing: 12) {
            ForEach(list) { c in
                StampView(country: c)
            }
        }
    }

    // MARK: - Layout

    var body: some View {
        NavigationStack {
            GeometryReader { geo in
                let available = geo.size.height
                let passportH = min(available * 0.72, 600)

                VStack(spacing: 10) {
                    Spacer(minLength: 6)

                    SpreadFlipView(spreads: spreads, index: $spreadIndex)
                        .frame(height: passportH)
                        .frame(maxWidth: .infinity, alignment: .center)

                    HStack(spacing: 8) {
                        ForEach(0..<spreads.count, id: \.self) { i in
                            Capsule()
                                .fill(Color.black.opacity(0.75))
                                .frame(width: i == spreadIndex ? 16 : 6, height: 6)
                                .opacity(i == spreadIndex ? 1 : 0.28)
                                .animation(.spring(response: 0.35, dampingFraction: 0.9), value: spreadIndex)
                                .onTapGesture { spreadIndex = i }
                        }
                    }
                    .padding(.top, 2)

                    Spacer(minLength: 10)
                }
                .padding(.horizontal, 14)
            }
            .overlay(
                LinearGradient(colors: [.black.opacity(0.08), .clear],
                               startPoint: .top, endPoint: .bottom)
                .frame(height: 22),
                alignment: .top
            )
            .navigationTitle("Passport")
            .navigationBarTitleDisplayMode(.inline)
            .onAppear { store.start() }
            .onDisappear { store.stop() }
        }
    }
}

// MARK: - Local UI pieces

private struct Card<Content: View>: View {
    @ViewBuilder var content: Content
    var body: some View {
        VStack(alignment: .leading, spacing: 0) { content }
            .padding(14)
            .background(RoundedRectangle(cornerRadius: 18, style: .continuous).fill(Color.black.opacity(0.04)))
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .stroke(Color.black.opacity(0.06), lineWidth: 1)
            )
    }
}

private struct Badge: View {
    let text: String
    let icon: String
    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
            Text(text)
        }
        .font(.system(size: 11, weight: .bold, design: .rounded))
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(Capsule().fill(Color.black.opacity(0.04)))
        .overlay(Capsule().stroke(Color.black.opacity(0.09), lineWidth: 1))
        .foregroundStyle(Color.black.opacity(0.75))
    }
}

private struct FieldRow: View {
    let key: String
    let value: String
    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(key.uppercased())
                .font(.system(size: 9, weight: .bold, design: .rounded))
                .tracking(1.2)
                .foregroundStyle(.secondary)
                .lineLimit(1)
                .minimumScaleFactor(0.85)

            Text(value)
                .font(.system(size: 14, weight: .heavy))
                .foregroundStyle(Color.black.opacity(0.88))
                .lineLimit(1)
                .minimumScaleFactor(0.75)
        }
    }
}

private struct MRZLine: View {
    let text: String
    init(_ text: String) { self.text = text }
    var body: some View {
        Text(text)
            .font(.system(size: 12, weight: .bold, design: .monospaced))
            .foregroundStyle(Color.black.opacity(0.70))
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 10)
            .padding(.vertical, 8)
            .background(RoundedRectangle(cornerRadius: 12, style: .continuous).fill(Color.black.opacity(0.05)))
            .overlay(RoundedRectangle(cornerRadius: 12, style: .continuous).stroke(Color.black.opacity(0.08), lineWidth: 1))
    }
}

private struct StatTile: View {
    let title: String
    let value: String
    let subtitle: String
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.system(size: 11, weight: .semibold))
                .foregroundStyle(.secondary)
            Text(value)
                .font(.system(size: 20, weight: .black))
                .lineLimit(1)
                .minimumScaleFactor(0.8)
            Text(subtitle)
                .font(.system(size: 11, weight: .semibold))
                .foregroundStyle(Color.black.opacity(0.55))
                .lineLimit(1)
                .minimumScaleFactor(0.8)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(RoundedRectangle(cornerRadius: 18, style: .continuous).fill(Color.black.opacity(0.04)))
        .overlay(RoundedRectangle(cornerRadius: 18, style: .continuous).stroke(Color.black.opacity(0.06), lineWidth: 1))
    }
}

private struct ProgressPill: View {
    let progress: Double
    var body: some View {
        let pct = Int((progress * 100).rounded())
        HStack(spacing: 8) {
            Image(systemName: "chart.line.uptrend.xyaxis")
            Text("\(pct)%")
        }
        .font(.system(size: 12, weight: .bold, design: .rounded))
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Capsule().fill(Color.black.opacity(0.05)))
        .overlay(Capsule().stroke(Color.black.opacity(0.09), lineWidth: 1))
        .foregroundStyle(Color.black.opacity(0.75))
    }
}

private struct ProgressRing: View {
    let progress: Double
    var body: some View {
        ZStack {
            Circle().stroke(Color.black.opacity(0.08), lineWidth: 10)
            Circle()
                .trim(from: 0, to: max(0, min(1, progress)))
                .stroke(Color.black.opacity(0.75), style: StrokeStyle(lineWidth: 10, lineCap: .round))
                .rotationEffect(.degrees(-90))
            Text("\(Int((progress * 100).rounded()))%")
                .font(.system(size: 12, weight: .black, design: .rounded))
                .foregroundStyle(Color.black.opacity(0.8))
        }
        .animation(.spring(response: 0.4, dampingFraction: 0.9), value: progress)
    }
}

private func nextMilestone(_ visited: Int) -> Int? {
    [10, 25, 50, 75, 100, 125, 150, 175, 195].first(where: { $0 > visited })
}

#Preview {
    PassportView()
}
