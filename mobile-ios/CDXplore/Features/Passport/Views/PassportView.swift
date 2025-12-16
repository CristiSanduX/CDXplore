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

    // MARK: - Build spreads

    private var spreads: [SpreadFlipView.Spread] {
        // 0) cover (single page)
        var out: [SpreadFlipView.Spread] = [
            .init(
                left: AnyView(
                    VStack(spacing: 14) {
                        PassportCoverView()
                        Text("Swipe to open")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
                ),
                right: AnyView(EmptyView()),
                isCover: true
            )
        ]

        // 1) inside spread: left = “Identity”, right = summary
        out.append(
            .init(
                left: AnyView(identityPage),
                right: AnyView(summaryPage),
                isCover: false
            )
        )

        // 2+) stamps pages paired into spreads
        let stampPages = buildStampPages(visitedCountries)
        var i = 0
        while i < stampPages.count {
            let left = stampPages[i]
            let right = (i + 1 < stampPages.count) ? stampPages[i + 1] : AnyView(emptyPage)
            out.append(.init(left: left, right: right, isCover: false))
            i += 2
        }

        return out
    }

    private var identityPage: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Identity")
                .font(.system(size: 18, weight: .black))

            VStack(alignment: .leading, spacing: 8) {
                row("Name", "CDXplorer")
                row("Nationality", "—")
                row("Passport No.", "CDX-000127")
                row("Issued", "2025")
            }
            .padding(14)
            .background(RoundedRectangle(cornerRadius: 18).fill(Color.black.opacity(0.04)))

            Spacer()
        }
    }

    private var summaryPage: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Summary")
                .font(.system(size: 18, weight: .black))

            PassportSummaryView(stats: stats)

            VStack(spacing: 10) {
                ForEach(["Europe","Asia","Africa","North America","South America","Oceania"], id: \.self) { c in
                    let v = stats.byContinent[c]?.visited ?? 0
                    let t = stats.byContinent[c]?.total ?? 0
                    HStack {
                        Text(c).font(.system(size: 13, weight: .semibold))
                        Spacer()
                        Text("\(v)/\(t)")
                            .font(.system(size: 13, weight: .heavy))
                            .foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 6)
                    .overlay(Rectangle().frame(height: 1).foregroundStyle(.black.opacity(0.06)), alignment: .bottom)
                }
            }

            Spacer()
        }
    }

    private func row(_ k: String, _ v: String) -> some View {
        HStack {
            Text(k)
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(.secondary)
            Spacer()
            Text(v)
                .font(.system(size: 12, weight: .heavy))
        }
    }

    private var emptyPage: some View {
        VStack(spacing: 10) {
            Text("Blank page")
                .font(.system(size: 16, weight: .bold))
            Text("More stamps coming soon.")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
    }

    private func buildStampPages(_ visited: [Country]) -> [AnyView] {
        // 12 stamps per page feels great: 3 columns x 4 rows
        let perPage = 12
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
                        Spacer()
                    }
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
                    Spacer()
                }
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

    // MARK: - UI

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 14) {
                    SpreadFlipView(spreads: spreads, index: $spreadIndex)

                    // dots per spread
                    HStack(spacing: 8) {
                        ForEach(0..<spreads.count, id: \.self) { i in
                            Capsule()
                                .fill(i == spreadIndex ? Color.black.opacity(0.75) : Color.black.opacity(0.18))
                                .frame(width: i == spreadIndex ? 18 : 8, height: 8)
                                .animation(.spring(response: 0.35, dampingFraction: 0.9), value: spreadIndex)
                                .onTapGesture { spreadIndex = i }
                        }
                    }
                    .padding(.top, 6)
                }
                .padding(.vertical, 12)
            }
            .navigationTitle("Passport")
            .navigationBarTitleDisplayMode(.inline)
            .onAppear { store.start() }
            .onDisappear { store.stop() }
        }
    }
}

#Preview {
    PassportView()
}
