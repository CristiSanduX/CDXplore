//
//  HomeView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 14.12.2025.
//


import SwiftUI

struct HomeView: View {
    var body: some View {
        NavigationStack {
            VStack(spacing: 14) {
                Text("CDXplore")
                    .font(.largeTitle).bold()

                Text("Your passport starts here.")
                    .foregroundStyle(.secondary)

                Spacer()
            }
            .padding()
            .navigationTitle("Home")
        }
    }
}
