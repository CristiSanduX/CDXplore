//
//  AuthViewModel.swift
//  CDXplore
//
//  Created by Cristi Sandu on 15.12.2025.
//

import Foundation
import FirebaseAuth
import Combine
import FirebaseCore
import GoogleSignIn
import UIKit

@MainActor
final class AuthViewModel: ObservableObject {

    @Published var user: User? = Auth.auth().currentUser
    @Published var isLoading = false
    @Published var errorMessage: String?

    private var handle: AuthStateDidChangeListenerHandle?

    init() {
        handle = Auth.auth().addStateDidChangeListener { [weak self] _, user in
            self?.user = user
        }
    }

    deinit {
        if let handle { Auth.auth().removeStateDidChangeListener(handle) }
    }

    // MARK: - Sign In

    func signInWithGoogle() async {
        guard let clientID = FirebaseApp.app()?.options.clientID else {
            errorMessage = "Missing Firebase clientID"
            return
        }

        guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let rootVC = scene.windows.first?.rootViewController else {
            errorMessage = "Missing root view controller"
            return
        }

        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            let config = GIDConfiguration(clientID: clientID)
            GIDSignIn.sharedInstance.configuration = config

            let result = try await GIDSignIn.sharedInstance.signIn(withPresenting: rootVC)

            guard let idToken = result.user.idToken?.tokenString else {
                throw NSError(
                    domain: "Auth",
                    code: -1,
                    userInfo: [NSLocalizedDescriptionKey: "Missing ID token"]
                )
            }

            let accessToken = result.user.accessToken.tokenString
            let credential = GoogleAuthProvider.credential(
                withIDToken: idToken,
                accessToken: accessToken
            )

            _ = try await Auth.auth().signIn(with: credential)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    // MARK: - Sign Out

    func signOut() {
        do {
            try Auth.auth().signOut()
            GIDSignIn.sharedInstance.signOut()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    // MARK: - Delete Account (App Store requirement)

    /// Deletes the current Firebase account.
    /// Note: Firebase may require a "recent login". If you hit that, ask the user to sign out and sign in again.
    func deleteAccount() async throws {
        errorMessage = nil

        guard let u = Auth.auth().currentUser else { return }

        isLoading = true
        defer { isLoading = false }

        do {
            // Optionally: cleanup user data here (Firestore/Storage) BEFORE deleting auth user.
            try await u.delete()

            // Ensure local state is cleared
            user = nil
            GIDSignIn.sharedInstance.signOut()
        } catch {
            // Bubble up so the UI can show a proper message
            errorMessage = error.localizedDescription
            throw error
        }
    }
}
