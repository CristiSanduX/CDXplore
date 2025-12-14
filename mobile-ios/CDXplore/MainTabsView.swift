//
//  MainTabsView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 14.12.2025.
//


import SwiftUI

struct MainTabsView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem { Label("Home", systemImage: "house.fill") }

            CountriesView()
                .tabItem { Label("Countries", systemImage: "globe.europe.africa.fill") }

            ProfileView()
                .tabItem { Label("Profile", systemImage: "person.fill") }
        }
    }
}
