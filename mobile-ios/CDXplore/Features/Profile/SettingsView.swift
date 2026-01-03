//
//  SettingsView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 01.01.2026.
//

import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var authVM: AuthViewModel

    @State private var showDeleteAlert = false
    @State private var isDeleting = false
    @State private var errorMessage: String?

    var body: some View {
        List {
            Section {
                Button("Sign out") {
                    authVM.signOut()
                }
            }

            Section {
                Button(role: .destructive) {
                    showDeleteAlert = true
                } label: {
                    if isDeleting {
                        HStack(spacing: 10) {
                            ProgressView()
                            Text("Deleting…")
                        }
                    } else {
                        Text("Delete account")
                    }
                }
                .disabled(isDeleting)
            }
        }
        .navigationTitle("Settings")
        .alert("Delete account?", isPresented: $showDeleteAlert) {
            Button("Delete", role: .destructive) {
                Task {
                    isDeleting = true
                    defer { isDeleting = false }
                    do {
                        try await authVM.deleteAccount()
                    } catch {
                        errorMessage = error.localizedDescription
                    }
                }
            }
            Button("Cancel", role: .cancel) { }
        } message: {
            Text("This action permanently deletes your account and all associated data.")
        }
        .alert("Couldn’t delete account", isPresented: .constant(errorMessage != nil)) {
            Button("OK", role: .cancel) { errorMessage = nil }
        } message: {
            Text(errorMessage ?? "")
        }
    }
}
