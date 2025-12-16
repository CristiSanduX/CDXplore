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
            VStack(spacing: 12) {
                if let u = auth.user {
                    Text(u.email ?? "Logged in").foregroundStyle(.secondary)
                }
                Button("Sign out") {
                    auth.signOut()
                }
                .buttonStyle(.bordered)
            }
            .padding()
            .navigationTitle("Profile")
        }
    }
}
