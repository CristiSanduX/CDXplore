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

            PassportView()
                .tabItem { Label("Passport", systemImage: "book.closed") }

            ProfileView()
                .tabItem { Label("Profile", systemImage: "person.fill") }
        }
        .tint(Color(red: 0.48, green: 0.12, blue: 0.23)) 
    }
}
