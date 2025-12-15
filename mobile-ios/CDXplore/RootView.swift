//
//  RootView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 14.12.2025.
//


import SwiftUI

struct RootView: View {
    @StateObject private var auth = AuthViewModel()

    var body: some View {
        Group {
            if auth.user != nil {
                MainTabsView()
                    .environmentObject(auth)
            } else {
                AuthView()
                    .environmentObject(auth)
            }
        }
    }
}
