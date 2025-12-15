//
//  AuthView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 15.12.2025.
//


import SwiftUI

struct AuthView: View {
    @EnvironmentObject var auth: AuthViewModel

    var body: some View {
        VStack(spacing: 16) {
            Text("CDXplore")
                .font(.largeTitle).bold()

            Text("Sign in to sync your passport.")
                .foregroundStyle(.secondary)

            Button {
                Task { await auth.signInWithGoogle() }
            } label: {
                HStack(spacing: 10) {
                    Image(systemName: "g.circle.fill")
                    Text(auth.isLoading ? "Signing in..." : "Continue with Google")
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
            }
            .buttonStyle(.borderedProminent)
            .disabled(auth.isLoading)

            if let msg = auth.errorMessage {
                Text(msg)
                    .font(.footnote)
                    .foregroundStyle(.red)
                    .multilineTextAlignment(.center)
            }
        }
        .padding()
    }
}
