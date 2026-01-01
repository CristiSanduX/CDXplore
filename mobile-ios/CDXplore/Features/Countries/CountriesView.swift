//
//  CountriesView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 14.12.2025.
//

import SwiftUI
import UIKit

struct CountriesView: View {

    enum ViewMode: String, CaseIterable, Identifiable {
        case grid = "Grid"
        case list = "List"
        var id: String { rawValue }
    }

    enum SortMode: String, CaseIterable, Identifiable {
        case visitedFirst = "Visited first"
        case nameAZ = "Name A–Z"
        case nameZA = "Name Z–A"
        var id: String { rawValue }
    }

    private let allContinents = [
        "All",
        "Europe",
        "Asia",
        "Africa",
        "North America",
        "South America",
        "Oceania"
    ]

    // brand burgundy
    private let ink = Color(red: 0.48, green: 0.12, blue: 0.23)

    @State private var query = ""
    @State private var visitedOnly = false
    @State private var viewMode: ViewMode = .grid
    @State private var sortMode: SortMode = .visitedFirst
    @State private var selectedContinent: String = "All"

    @StateObject private var store = VisitedStore()

    private let countries: [Country] = CountriesData.all

    var body: some View {
        NavigationStack {
            GeometryReader { geo in
                VStack(spacing: 14) {
                    header
                    controls
                    continentStats
                    content(width: geo.size.width)
                }
                .padding(.horizontal, 16)
                .padding(.top, 10)
                .navigationTitle("Countries")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar { toolbarMenu }
                .onAppear { store.start() }
                .onDisappear { store.stop() }
            }
        }
    }

    // MARK: - Header

    private var header: some View {
        let total = countries.count
        let visitedCount = store.visited.count
        let progress = total == 0 ? 0.0 : Double(visitedCount) / Double(total)

        return VStack(alignment: .leading, spacing: 10) {
            Text("Your passport, but interactive.")
                .font(.system(size: 22, weight: .bold))

            HStack(alignment: .center, spacing: 10) {
                Text("\(visitedCount) visited • \(total) total")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(.secondary)

                Spacer()

                Text("\(Int((progress * 100).rounded()))%")
                    .font(.system(size: 12, weight: .heavy))
                    .foregroundStyle(.secondary)
            }

            ProgressView(value: progress)
                .tint(ink.opacity(0.85))
                .scaleEffect(x: 1, y: 1.2, anchor: .center)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.top, 4)
    }

    // MARK: - Controls

    private var controls: some View {
        VStack(spacing: 10) {

            // Search
            HStack(spacing: 10) {
                Image(systemName: "magnifyingglass")
                    .foregroundStyle(.secondary)

                TextField("Search countries…", text: $query)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .submitLabel(.search)

                if !query.isEmpty {
                    Button { query = "" } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(.secondary)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 12)
            .background(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .fill(Color.black.opacity(0.04))
            )

            // Row 2: filters
            HStack(spacing: 10) {
                Toggle("Visited only", isOn: $visitedOnly)
                    .toggleStyle(.switch)
                    .font(.system(size: 13, weight: .semibold))

                Spacer()

                // Continent filter
                Menu {
                    Picker("Continent", selection: $selectedContinent) {
                        ForEach(allContinents, id: \.self) { c in
                            Text(c).tag(c)
                        }
                    }
                } label: {
                    Label(selectedContinent == "All" ? "All continents" : selectedContinent,
                          systemImage: "globe")
                    .font(.system(size: 13, weight: .semibold))
                }

                // Sort
                Menu {
                    Picker("Sort", selection: $sortMode) {
                        ForEach(SortMode.allCases) { m in
                            Text(m.rawValue).tag(m)
                        }
                    }
                } label: {
                    Label("Sort", systemImage: "arrow.up.arrow.down")
                        .font(.system(size: 13, weight: .semibold))
                }

                // View mode
                Menu {
                    Picker("View", selection: $viewMode) {
                        ForEach(ViewMode.allCases) { m in
                            Text(m.rawValue).tag(m)
                        }
                    }
                } label: {
                    Image(systemName: viewMode == .grid ? "square.grid.2x2" : "list.bullet")
                        .font(.system(size: 14, weight: .semibold))
                        .padding(.leading, 2)
                }
            }
        }
    }

    // MARK: - Continent Stats (chips)

    private var continentStats: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(allContinents.filter { $0 != "All" }, id: \.self) { cont in
                    let (v, t) = continentCount(cont)
                    ContinentChip(
                        title: cont,
                        visited: v,
                        total: t,
                        isActive: selectedContinent == cont
                    ) {
                        withAnimation(.easeInOut(duration: 0.18)) {
                            selectedContinent = (selectedContinent == cont) ? "All" : cont
                        }
                        lightHaptic()
                    }
                }
            }
            .padding(.vertical, 2)
        }
        .scrollDismissesKeyboard(.immediately)
    }

    private func continentCount(_ continent: String) -> (visited: Int, total: Int) {
        let list = countries.filter { $0.continent == continent }
        let total = list.count
        let visited = list.reduce(0) { $0 + (store.visited.contains($1.code.uppercased()) ? 1 : 0) }
        return (visited, total)
    }

    // MARK: - Content

    private func content(width: CGFloat) -> some View {
        let data = filteredAndSorted

        return Group {
            if data.isEmpty {
                CountriesEmptyState()
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                if viewMode == .grid {
                    grid(data, width: width)
                } else {
                    list(data)
                }
            }
        }
        .animation(.easeInOut(duration: 0.2), value: query)
        .animation(.easeInOut(duration: 0.2), value: visitedOnly)
        .animation(.easeInOut(duration: 0.2), value: sortMode)
        .animation(.easeInOut(duration: 0.2), value: viewMode)
        .animation(.easeInOut(duration: 0.2), value: selectedContinent)
        .scrollDismissesKeyboard(.immediately)
    }

    private func grid(_ data: [Country], width: CGFloat) -> some View {
        // Adaptive columns:
        // - smaller iPhones: 2 cols
        // - wider screens: 3 cols (optional, feels premium)
        let columnsCount = width >= 430 ? 3 : 2
        let cols = Array(repeating: GridItem(.flexible(), spacing: 12), count: columnsCount)

        return ScrollView {
            LazyVGrid(columns: cols, spacing: 12) {
                ForEach(data) { c in
                    CountryCard(
                        country: c,
                        isVisited: store.visited.contains(c.code.uppercased()),
                        onToggle: {
                            store.toggle(c.code)
                            lightHaptic()
                        }
                    )
                }
            }
            .padding(.vertical, 12)
        }
    }

    private func list(_ data: [Country]) -> some View {
        ScrollView {
            LazyVStack(spacing: 10) {
                ForEach(data) { c in
                    CountryRow(
                        country: c,
                        isVisited: store.visited.contains(c.code.uppercased()),
                        onToggle: {
                            store.toggle(c.code)
                            lightHaptic()
                        }
                    )
                }
            }
            .padding(.vertical, 12)
        }
    }

    // MARK: - Filtering / Sorting

    private var filteredAndSorted: [Country] {
        var data = countries
        let visited = store.visited

        // continent filter
        if selectedContinent != "All" {
            data = data.filter { $0.continent == selectedContinent }
        }

        // search
        let trimmed = query.trimmingCharacters(in: .whitespacesAndNewlines)
        if !trimmed.isEmpty {
            let q = trimmed.lowercased()
            data = data.filter {
                $0.name.lowercased().contains(q) ||
                $0.code.lowercased().contains(q) ||
                $0.continent.lowercased().contains(q)
            }
        }

        // visited only
        if visitedOnly {
            data = data.filter { visited.contains($0.code.uppercased()) }
        }

        // sort
        switch sortMode {
        case .visitedFirst:
            data.sort { a, b in
                let av = visited.contains(a.code.uppercased())
                let bv = visited.contains(b.code.uppercased())
                if av != bv { return av && !bv }
                return a.name < b.name
            }
        case .nameAZ:
            data.sort { $0.name < $1.name }
        case .nameZA:
            data.sort { $0.name > $1.name }
        }

        return data
    }

    // MARK: - Bulk actions

    private var toolbarMenu: some ToolbarContent {
        ToolbarItem(placement: .topBarTrailing) {
            Menu {
                Button {
                    markAllVisibleVisited()
                } label: {
                    Label("Mark all visible visited", systemImage: "checkmark.circle")
                }

                Button(role: .destructive) {
                    clearAllVisibleVisited()
                } label: {
                    Label("Clear visible visited", systemImage: "xmark.circle")
                }
            } label: {
                Image(systemName: "ellipsis.circle")
            }
        }
    }

    private func markAllVisibleVisited() {
        let visible = filteredAndSorted.map { $0.code.uppercased() }
        guard !visible.isEmpty else { return }

        visible.forEach { code in
            if !store.visited.contains(code) {
                store.toggle(code)
            }
        }
        mediumHaptic()
    }

    private func clearAllVisibleVisited() {
        let visible = filteredAndSorted.map { $0.code.uppercased() }
        guard !visible.isEmpty else { return }

        visible.forEach { code in
            if store.visited.contains(code) {
                store.toggle(code)
            }
        }
        mediumHaptic()
    }

    // MARK: - Haptics

    private func lightHaptic() {
        let gen = UIImpactFeedbackGenerator(style: .light)
        gen.prepare()
        gen.impactOccurred(intensity: 0.8)
    }

    private func mediumHaptic() {
        let gen = UIImpactFeedbackGenerator(style: .medium)
        gen.prepare()
        gen.impactOccurred(intensity: 0.9)
    }
}

// MARK: - Chip

private struct ContinentChip: View {
    let title: String
    let visited: Int
    let total: Int
    let isActive: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 8) {
                Text(title)
                    .font(.system(size: 12, weight: .heavy))
                    .lineLimit(1)

                Text("\(visited)/\(total)")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(.secondary)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(
                RoundedRectangle(cornerRadius: 999, style: .continuous)
                    .fill(isActive ? Color.black.opacity(0.08) : Color.black.opacity(0.04))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 999, style: .continuous)
                    .stroke(Color.black.opacity(isActive ? 0.18 : 0.10), lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    CountriesView()
}


