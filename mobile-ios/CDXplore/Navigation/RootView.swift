//
//  RootView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 14.12.2025.
//


import SwiftUI

struct RootView: View {
    @StateObject private var auth = AuthViewModel()
    @State private var showSplash = true

    var body: some View {
        ZStack {
            Group {
                if auth.user != nil {
                    MainTabsView()
                        .environmentObject(auth)
                } else {
                    AuthView()
                        .environmentObject(auth)
                }
            }
            .opacity(showSplash ? 0 : 1)

            if showSplash {
                SplashScreenView(isPresented: $showSplash)
                    .transition(.opacity)
                    .zIndex(10)
            }
        }
    }
}
