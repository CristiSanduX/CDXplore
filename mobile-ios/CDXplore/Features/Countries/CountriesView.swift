//
//  CountriesView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 14.12.2025.
//


import SwiftUI

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

    @State private var query = ""
    @State private var visitedOnly = false
    @State private var viewMode: ViewMode = .grid
    @State private var sortMode: SortMode = .visitedFirst

    @StateObject private var store = VisitedStore()

    private let countries: [Country] = CountriesData.all

    var body: some View {
        NavigationStack {
            VStack(spacing: 14) {
                header
                controls
                content
            }
            .padding(.horizontal, 16)
            .padding(.top, 10)
            .navigationTitle("Countries")
            .navigationBarTitleDisplayMode(.inline)
            .onAppear { store.start() }
            .onDisappear { store.stop() }
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Your passport, but interactive.")
                .font(.system(size: 22, weight: .bold))

            Text("\(store.visited.count) visited • \(max(0, countries.count - store.visited.count)) remaining")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.top, 4)
    }

    private var controls: some View {
        VStack(spacing: 10) {
            HStack(spacing: 10) {
                Image(systemName: "magnifyingglass")
                    .foregroundStyle(.secondary)

                TextField("Search countries…", text: $query)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()

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

            HStack(spacing: 10) {
                Toggle("Visited only", isOn: $visitedOnly)
                    .toggleStyle(.switch)
                    .font(.system(size: 13, weight: .semibold))

                Spacer()

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

    private var content: some View {
        let data = filteredAndSorted

        return Group {
            if data.isEmpty {
                CountriesEmptyState()
            } else {
                if viewMode == .grid {
                    grid(data)
                } else {
                    list(data)
                }
            }
        }
        .animation(.easeInOut(duration: 0.2), value: query)
        .animation(.easeInOut(duration: 0.2), value: visitedOnly)
        .animation(.easeInOut(duration: 0.2), value: sortMode)
        .animation(.easeInOut(duration: 0.2), value: viewMode)
    }

    private func grid(_ data: [Country]) -> some View {
        let cols = [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)]
        return ScrollView {
            LazyVGrid(columns: cols, spacing: 12) {
                ForEach(data) { c in
                    CountryCard(
                        country: c,
                        isVisited: store.visited.contains(c.code),
                        onToggle: {
                            store.toggle(c.code)
                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
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
                        isVisited: store.visited.contains(c.code),
                        onToggle: {
                            store.toggle(c.code)
                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
                        }
                    )
                }
            }
            .padding(.vertical, 12)
        }
    }

    private var filteredAndSorted: [Country] {
        var data = countries
        let visited = store.visited

        if !query.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            let q = query.lowercased()
            data = data.filter {
                $0.name.lowercased().contains(q) ||
                $0.code.lowercased().contains(q) ||
                $0.continent.lowercased().contains(q)
            }
        }

        if visitedOnly {
            data = data.filter { visited.contains($0.code) }
        }

        switch sortMode {
        case .visitedFirst:
            data.sort { a, b in
                let av = visited.contains(a.code)
                let bv = visited.contains(b.code)
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
}

#Preview {
    CountriesView()
}
