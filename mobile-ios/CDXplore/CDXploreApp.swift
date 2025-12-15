//
//  CDXploreApp.swift
//  CDXplore
//
//  Created by Cristi Sandu on 14.12.2025.
//

import SwiftUI
import FirebaseCore
import GoogleSignIn

@main
struct CDXploreApp: App {
    init() {
        FirebaseApp.configure()
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .onOpenURL { url in
                    GIDSignIn.sharedInstance.handle(url)
                }
        }
    }
}
