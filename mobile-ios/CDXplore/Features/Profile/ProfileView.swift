//
//  ProfileView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 14.12.2025.
//


import SwiftUI
import FirebaseAuth

struct ProfileView: View {
    @EnvironmentObject var auth: AuthViewModel

    var body: some View {
        NavigationStack {
            List {
                if let u = auth.user {
                    Section {
                        Text(u.email ?? "Logged in")
                            .foregroundStyle(.secondary)
                    }
                }

                Section {
                    NavigationLink("Settings") {
                        SettingsView()
                    }
                }
            }
            .navigationTitle("Profile")
        }
    }
}
