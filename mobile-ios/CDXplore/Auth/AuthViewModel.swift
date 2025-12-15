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
            GIDSignIn.sharedInstance.configuration = config   // ✅ AICI

            let result = try await GIDSignIn.sharedInstance.signIn(
                withPresenting: rootVC                          // ✅ FĂRĂ configuration
            )

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


    func signOut() {
        do {
            try Auth.auth().signOut()
            GIDSignIn.sharedInstance.signOut()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
